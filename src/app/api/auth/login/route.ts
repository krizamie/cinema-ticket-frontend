import { authenticateUser } from "@/lib/server/users"

export const runtime = "nodejs"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ message: "Send login details as JSON." }, { status: 415 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json({ message: "The request body must be valid JSON." }, { status: 400 })
  }

  if (!isRecord(payload)) {
    return Response.json({ message: "Login details are required." }, { status: 400 })
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
  const password = typeof payload.password === "string" ? payload.password : ""

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ message: "Enter a valid email address." }, { status: 400 })
  }

  if (password.length === 0 || password.length > 128) {
    return Response.json({ message: "Enter a valid password." }, { status: 400 })
  }

  try {
    const result = await authenticateUser(email, password)

    if (!result) {
      return Response.json({ message: "Email or password is incorrect." }, { status: 401 })
    }

    return Response.json(result)
  } catch (error) {
    console.error("Sign-in failed:", error)
    return Response.json(
      { message: "We could not sign you in right now. Please try again." },
      { status: 500 },
    )
  }
}
