import { createUser } from "@/lib/server/users"

export const runtime = "nodejs"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ message: "Send registration details as JSON." }, { status: 415 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json({ message: "The request body must be valid JSON." }, { status: 400 })
  }

  if (!isRecord(payload)) {
    return Response.json({ message: "Registration details are required." }, { status: 400 })
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : ""
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
  const password = typeof payload.password === "string" ? payload.password : ""
  const termsAccepted = payload.termsAccepted === true

  if (name.length < 2 || name.length > 80) {
    return Response.json({ message: "Name must be between 2 and 80 characters." }, { status: 400 })
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ message: "Enter a valid email address." }, { status: 400 })
  }

  if (password.length < 8 || password.length > 128) {
    return Response.json({ message: "Password must be between 8 and 128 characters." }, { status: 400 })
  }

  if (!termsAccepted) {
    return Response.json({ message: "You must accept the terms to create an account." }, { status: 400 })
  }

  try {
    const user = await createUser(name, email, password)

    if (!user) {
      return Response.json(
        { message: "An account with this email already exists." },
        { status: 409 },
      )
    }

    return Response.json(
      { message: "Your account has been created.", user },
      { status: 201 },
    )
  } catch (error) {
    console.error("Account registration failed:", error)
    return Response.json(
      { message: "We could not create your account right now. Please try again." },
      { status: 500 },
    )
  }
}
