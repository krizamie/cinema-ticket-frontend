"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { post, ApiError } from "@/lib/api"
import {
  ArrowLeft,
  Clapperboard,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")
    setMessage("")
    setIsRegistered(false)

    if (password !== confirmPassword) {
      setMessage("The passwords do not match. Please check them and try again.")
      return
    }

    setIsSubmitting(true)

    try {
      await post("/api/auth/register", {
        name: formData.get("name"),
        email: formData.get("email"),
        password,
        termsAccepted: formData.get("terms") === "on",
      })
      setIsRegistered(true)
      setMessage("Your account is ready. Sign in to continue.")
      form.reset()
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "We could not reach the registration service. Please try again.",
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
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5 font-semibold tracking-wide">
          <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500">
            <Clapperboard className="size-5" aria-hidden="true" />
          </span>
          <span>
            CINEMA<span className="text-violet-400">TIX</span>
          </span>
        </Link>

        <p className="text-sm font-semibold tracking-widest text-violet-300">JOIN CINEMATIX</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Sign up to start planning your next movie night.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/85">
              Full name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 transition focus-within:border-violet-400/70">
              <UserRound className="size-4 shrink-0 text-white/40" aria-hidden="true" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                required
                minLength={2}
                className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
          </div>

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
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/85">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 transition focus-within:border-violet-400/70">
              <LockKeyhole className="size-4 shrink-0 text-white/40" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                required
                minLength={8}
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

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-white/85">
              Confirm password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 transition focus-within:border-violet-400/70">
              <LockKeyhole className="size-4 shrink-0 text-white/40" aria-hidden="true" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password again"
                required
                minLength={8}
                className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((isVisible) => !isVisible)}
                className="rounded-md p-1 text-white/45 transition hover:text-white"
                aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-1 text-sm leading-5 text-white/60">
            <input
              type="checkbox"
              name="terms"
              required
              className="mt-0.5 size-4 shrink-0 rounded border-white/20 accent-violet-500"
            />
            <span>
              I agree to the terms of service and privacy policy.
            </span>
          </label>

          {message && (
            <p
              role={isRegistered ? "status" : "alert"}
              className={`rounded-xl border px-4 py-3 text-sm ${
                isRegistered
                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                  : "border-amber-300/20 bg-amber-300/10 text-amber-100"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-violet-500 px-4 font-semibold transition hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/55">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-violet-300 transition hover:text-violet-200">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
