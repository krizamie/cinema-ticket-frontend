"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  Clapperboard,
  MapPin,
  Search,
  Star,
  Ticket,
} from "lucide-react"

const movies = [
  {
    title: "Midnight in Motion",
    genre: "Action",
    rating: "8.7",
    duration: "2h 08m",
    label: "NOW SHOWING",
    colors: "from-indigo-950 via-violet-900 to-fuchsia-700",
    artwork: "✦",
  },
  {
    title: "The Last Orchard",
    genre: "Drama",
    rating: "8.3",
    duration: "1h 54m",
    label: "NOW SHOWING",
    colors: "from-emerald-950 via-teal-800 to-amber-700",
    artwork: "❋",
  },
  {
    title: "Orbit of Tomorrow",
    genre: "Sci-Fi",
    rating: "9.1",
    duration: "2h 16m",
    label: "POPULAR",
    colors: "from-sky-950 via-blue-800 to-cyan-500",
    artwork: "◉",
  },
  {
    title: "Little Cloud Club",
    genre: "Animation",
    rating: "8.5",
    duration: "1h 42m",
    label: "NOW SHOWING",
    colors: "from-orange-950 via-rose-700 to-yellow-500",
    artwork: "☁",
  },
  {
    title: "The Quiet Signal",
    genre: "Thriller",
    rating: "8.1",
    duration: "1h 58m",
    label: "NEW",
    colors: "from-slate-950 via-slate-800 to-red-900",
    artwork: "⌁",
  },
  {
    title: "Summer, Again",
    genre: "Romance",
    rating: "7.9",
    duration: "1h 49m",
    label: "NOW SHOWING",
    colors: "from-pink-950 via-rose-700 to-orange-400",
    artwork: "♡",
  },
]

const genres = ["All movies", "Action", "Drama", "Sci-Fi", "Animation", "Thriller", "Romance"]

export default function DashboardPage() {
  const [query, setQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All movies")

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return movies.filter((movie) => {
      const matchesGenre = selectedGenre === "All movies" || movie.genre === selectedGenre
      const matchesQuery =
        normalizedQuery.length === 0 ||
        movie.title.toLowerCase().includes(normalizedQuery) ||
        movie.genre.toLowerCase().includes(normalizedQuery)

      return matchesGenre && matchesQuery
    })
  }, [query, selectedGenre])

  return (
    <main className="min-h-screen bg-[#09080f] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-wide">
            <span className="flex size-9 items-center justify-center rounded-xl bg-violet-500 text-white">
              <Clapperboard className="size-5" aria-hidden="true" />
            </span>
            <span>
              CINEMA<span className="text-violet-400">TIX</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-white/65 sm:flex">
            <a href="#movies" className="transition hover:text-white">Movies</a>
            <a href="#experience" className="transition hover:text-white">Our experience</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-400"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-medium tracking-wide text-violet-200">
            <Ticket className="size-3.5" aria-hidden="true" />
            YOUR NEXT FAVORITE NIGHT OUT
          </p>
          <h1 className="max-w-2xl text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
            Big stories.
            <br />
            <span className="text-violet-400">Bigger screen.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
            Find a film, pick your seats, and make tonight a movie night.
            Discover what&apos;s playing at your cinema.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#movies"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold transition hover:bg-violet-400"
            >
              Explore movies <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          id="experience"
          className="relative min-h-72 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950 via-[#24143e] to-[#100d19] p-7 sm:min-h-80 sm:p-9"
        >
          <div className="absolute -top-20 -right-10 size-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-10 size-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative flex h-full min-h-56 flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-widest text-violet-100">
                THE CINEMA EXPERIENCE
              </span>
              <Star className="size-5 fill-amber-300 text-amber-300" aria-label="Featured" />
            </div>
            <div className="py-8 text-center">
              <div className="mb-3 text-6xl text-white/90" aria-hidden="true">✦</div>
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">Make it a moment.</p>
              <p className="mt-2 text-sm text-white/60">Great films are better together.</p>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/65">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-violet-300" aria-hidden="true" />
                Find your nearby cinema
              </span>
              <CalendarDays className="size-4" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section id="movies" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-widest text-violet-300">ON THE BIG SCREEN</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Find your next film</h2>
          </div>
          <label className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/55 focus-within:border-violet-400/70 md:max-w-sm">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Search movies</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies or genres"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </label>
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {genres.map((genre) => {
            const isSelected = selectedGenre === genre

            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                aria-pressed={isSelected}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                  isSelected
                    ? "bg-violet-500 font-semibold text-white"
                    : "border border-white/10 text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                {genre}
              </button>
            )
          })}
        </div>

        {filteredMovies.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMovies.map((movie) => (
              <article
                key={movie.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:-translate-y-1 hover:border-violet-300/30"
              >
                <div className={`relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br ${movie.colors}`}>
                  <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />
                  <span className="relative text-8xl font-light text-white/75 drop-shadow-lg" aria-hidden="true">
                    {movie.artwork}
                  </span>
                  <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-bold tracking-widest backdrop-blur-sm">
                    {movie.label}
                  </span>
                  <span className="absolute right-4 bottom-4 rounded-lg bg-black/35 px-2.5 py-1 text-xs backdrop-blur-sm">
                    {movie.duration}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{movie.title}</h3>
                      <p className="mt-1 text-sm text-white/50">{movie.genre}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-300/10 px-2 py-1 text-sm font-semibold text-amber-200">
                      <Star className="size-3.5 fill-current" aria-hidden="true" />
                      {movie.rating}
                    </span>
                  </div>
                  <Link
                    href="/login"
                    className="mt-5 flex items-center justify-between rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-violet-300/40 hover:bg-violet-500/10 hover:text-white"
                  >
                    Sign in to book
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-white/60">
            No movies match your search. Try another title or genre.
          </p>
        )}
      </section>
    </main>
  )
}
