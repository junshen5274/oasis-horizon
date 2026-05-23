import Link from "next/link";

function LoadingBlock() {
  return (
    <div className="h-16 rounded-lg border border-slate-800 bg-slate-900/50" />
  );
}

export default function PolicyTermDetailLoading() {
  return (
    <main className="min-h-screen">
      <section className="flex-1 px-6 py-8 lg:px-10">
        <Link
          href="/policy-terms"
          className="mb-6 inline-flex text-sm text-sky-300 hover:text-sky-200"
        >
          Back to Policy Terms
        </Link>

        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Policy Detail
          </p>
          <div className="mt-3 h-7 w-44 rounded-md bg-slate-800" />
          <div className="mt-3 h-5 w-64 rounded-md bg-slate-800/80" />
        </div>

        <div className="grid gap-5">
          <LoadingBlock />
          <LoadingBlock />
          <LoadingBlock />
        </div>
      </section>
    </main>
  );
}
