"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ApiError, post } from "@/lib/api"
import { setAuthToken } from "@/lib/auth"
import { ArrowLeft, Clapperboard, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"

type LoginResponse = {
  token: string
  user: {
    id: number
    name: string
    email: string
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email")
    const password = formData.get("password")
    setMessage("")
    setIsSubmitting(true)

    try {
      const result = await post<LoginResponse>("/api/auth/login", { email, password })
      setAuthToken(result.token, formData.get("remember") === "on")
      router.replace("/dashboard")
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "We could not reach the sign-in service. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09080f] px-5 py-12 text-white">
      <div className="pointer-events-none absolute -top-40 -left-24 size-96 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-40 size-96 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <Link
        href="/"
        className="absolute top-6 left-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/65 transition hover:bg-white/10 hover:text-white sm:left-8"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to home
      </Link>

      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-9">
        <Link href="/" className="mb-9 inline-flex items-center gap-2.5 font-semibold tracking-wide">
          <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500">
            <Clapperboard className="size-5" aria-hidden="true" />
          </span>
          <span>
            CINEMA<span className="text-violet-400">TIX</span>
          </span>
        </Link>

        <p className="text-sm font-semibold tracking-widest text-violet-300">WELCOME BACK</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Sign in to your account</h1>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Sign in to continue to your bookings and movie nights.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/85">
              Email address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 transition focus-within:border-violet-400/70">
              <Mail className="size-4 shrink-0 text-white/40" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="password" className="text-sm font-medium text-white/85">
                Password
              </label>
              <span className="text-xs text-white/40">Keep your account secure</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 transition focus-within:border-violet-400/70">
              <LockKeyhole className="size-4 shrink-0 text-white/40" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword((isVisible) => !isVisible)}
                className="rounded-md p-1 text-white/45 transition hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-white/65">
            <input
              type="checkbox"
              name="remember"
              className="size-4 rounded border-white/20 accent-violet-500"
            />
            Remember me on this device
          </label>

          {message && (
            <p
              role="alert"
              className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-violet-500 px-4 font-semibold transition hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-white/55">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-violet-300 transition hover:text-violet-200">
            Create one
          </Link>
        </p>
      </section>
    </main>
  )
}
