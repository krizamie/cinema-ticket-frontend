
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-purple-400">
        CINEMA TICKET BOOKING
      </h1>

      <p className="mt-4 text-lg text-gray-300">
        Book your favorite movies anytime, anywhere.
      </p>

      <div className="flex gap-4 mt-8">
        <a
          href="/login"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
        >
          Login
        </a>

        <a
          href="/register"
          className="border border-purple-500 hover:bg-purple-900 px-6 py-3 rounded-lg"
        >
          Register
        </a>
      </div>
    </main>
  );
}
