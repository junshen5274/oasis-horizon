import Link from "next/link";
import { AssistantDrawerToggle } from "@/components/assistant-drawer-toggle";
import { fetchPolicyTerm } from "@/lib/api";

export default async function PolicyTermDetailPage({
  params
}: {
  params: { termId: string };
}) {
  const result = await fetchPolicyTerm(params.termId);

  return (
    <main className="min-h-screen">
      <section className="flex-1 px-6 py-8 lg:px-10">
        <Link
          href="/policy-terms"
          className="mb-6 inline-flex text-sm text-sky-300 hover:text-sky-200"
        >
          ← Back to Policy Terms
        </Link>

        {result.ok ? (
          <>
            <header className="mb-6 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Policy Detail
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-white">
                {result.data.policyNumber}
              </h1>
              <p className="text-slate-300">{result.data.insuredName}</p>
            </header>

            <dl className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Term
                </dt>
                <dd className="mt-1 text-slate-100">#{result.data.termNumber}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Status
                </dt>
                <dd className="mt-1 text-slate-100">{result.data.status}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  State
                </dt>
                <dd className="mt-1 text-slate-100">{result.data.state}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Balance Due
                </dt>
                <dd className="mt-1 text-slate-100">${result.data.balanceDue}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Effective Date
                </dt>
                <dd className="mt-1 text-slate-100">
                  {result.data.effectiveFromDate}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Expiration Date
                </dt>
                <dd className="mt-1 text-slate-100">{result.data.effectiveToDate}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Next Due Date
                </dt>
                <dd className="mt-1 text-slate-100">
                  {result.data.nextDueDate ?? "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Last Payment Date
                </dt>
                <dd className="mt-1 text-slate-100">
                  {result.data.lastPaymentDate ?? "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Created
                </dt>
                <dd className="mt-1 text-slate-100">
                  {new Date(result.data.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Updated
                </dt>
                <dd className="mt-1 text-slate-100">
                  {new Date(result.data.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <div className="rounded-xl border border-amber-700/40 bg-amber-950/30 p-4 text-sm text-amber-100">
            <p className="font-medium">Policy detail is temporarily unavailable.</p>
            <p className="mt-1 text-amber-200/90">{result.error.message}</p>
          </div>
        )}
      </section>

      <AssistantDrawerToggle />
    </main>
  );
}
