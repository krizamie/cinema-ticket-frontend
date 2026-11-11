import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"

export type PublicUser = {
  id: number
  name: string
  email: string
}

function openDatabase(): DatabaseSync {
  const dataDirectory = join(process.cwd(), ".data")
  mkdirSync(dataDirectory, { recursive: true })

  const database = new DatabaseSync(join(dataDirectory, "users.sqlite"))
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  database.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  database.exec("PRAGMA foreign_keys = ON")

  return database
}

function hashPassword(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error)
        return
      }

      resolve(derivedKey)
    })
  })
}

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<PublicUser | null> {
  const salt = randomBytes(16)
  const passwordHash = await hashPassword(password, salt)
  const database = openDatabase()

  try {
    const result = database
      .prepare(`
        INSERT INTO users (name, email, password_salt, password_hash)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(email) DO NOTHING
      `)
      .run(name, email, salt.toString("hex"), passwordHash.toString("hex"))

    if (Number(result.changes) === 0) {
      return null
    }

    return {
      id: Number(result.lastInsertRowid),
      name,
      email,
    }
  } finally {
    database.close()
  }
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<{ user: PublicUser; token: string } | null> {
  const database = openDatabase()

  try {
    const row = database
      .prepare(`
        SELECT id, name, email, password_salt, password_hash
        FROM users
        WHERE email = ?
      `)
      .get(email)

    if (
      !row ||
      typeof row.password_salt !== "string" ||
      typeof row.password_hash !== "string"
    ) {
      return null
    }

    const salt = Buffer.from(row.password_salt, "hex")
    const storedHash = Buffer.from(row.password_hash, "hex")
    if (salt.length !== 16 || storedHash.length !== 64) {
      throw new Error("Stored password hash has an invalid format.")
    }

    const suppliedHash = await hashPassword(password, salt)
    if (!timingSafeEqual(storedHash, suppliedHash)) {
      return null
    }

    const user: PublicUser = {
      id: Number(row.id),
      name: String(row.name),
      email: String(row.email),
    }
    const token = randomBytes(32).toString("base64url")
    const tokenHash = createHash("sha256").update(token).digest("hex")
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()

    database
      .prepare("DELETE FROM sessions WHERE expires_at <= ?")
      .run(new Date().toISOString())
    database
      .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
      .run(tokenHash, user.id, expiresAt)

    return { user, token }
  } finally {
    database.close()
  }
}
