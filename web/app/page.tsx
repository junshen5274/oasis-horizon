export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Oasis Horizon
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Policy Inquiry/Search
        </h1>
        <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
          A modern, read-only workspace for underwriters to explore policies,
          grounded summaries, and AI-assisted search.
        </p>
      </div>
      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-slate-100">
          Phase 1 scaffold
        </h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Next.js App Router + TypeScript + Tailwind CSS</li>
          <li>• Spring Boot API with /health and /ready endpoints</li>
          <li>• Monorepo structure ready for v1 build-out</li>
        </ul>
      </section>
    </main>
  );
}
