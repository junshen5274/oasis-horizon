import Link from "next/link";
import { AssistantDrawerToggle } from "@/components/assistant-drawer-toggle";
import { fetchPolicyTerms, type PolicyTermSearchParams } from "@/lib/api";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParams, key: string): string {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parsePage(searchParams: SearchParams): number {
  const raw = Number(getParam(searchParams, "page"));
  return Number.isFinite(raw) && raw >= 0 ? raw : 0;
}

export default async function PolicyTermsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const q = getParam(searchParams, "q");
  const state = getParam(searchParams, "state");
  const status = getParam(searchParams, "status");
  const expFrom = getParam(searchParams, "exp_from");
  const expTo = getParam(searchParams, "exp_to");
  const page = parsePage(searchParams);

  const filters: PolicyTermSearchParams = {
    q,
    state,
    status,
    exp_from: expFrom,
    exp_to: expTo,
    page,
    size: 20,
    sort: "effective_to_date,asc"
  };

  const result = await fetchPolicyTerms(filters);

  if (!result.ok) {
    return (
      <main className="min-h-screen lg:flex">
        <section className="flex-1 px-6 py-8 lg:px-10">
          <header className="mb-6 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Oasis Horizon
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Policy Terms
            </h1>
            <p className="text-slate-300">
              Read-only policy inquiry list for underwriters.
            </p>
          </header>

          <form className="mb-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-2 xl:grid-cols-5">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search policy # or insured"
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <input
              name="state"
              defaultValue={state}
              placeholder="State (e.g. CA)"
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <input
              name="status"
              defaultValue={status}
              placeholder="Status"
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <input
              name="exp_from"
              defaultValue={expFrom}
              type="date"
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <input
                name="exp_to"
                defaultValue={expTo}
                type="date"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
              >
                Search
              </button>
            </div>
          </form>

          <div className="rounded-xl border border-amber-700/40 bg-amber-950/30 p-4 text-sm text-amber-100">
            <p className="font-medium">Policy terms are temporarily unavailable.</p>
            <p className="mt-1 text-amber-200/90">{result.error.message}</p>
          </div>
        </section>

        <AssistantDrawerToggle />
      </main>
    );
  }

  const termPage = result.data;
  const previousPage = Math.max(termPage.page - 1, 0);
  const nextPage = Math.min(termPage.page + 1, Math.max(termPage.totalPages - 1, 0));

  return (
    <main className="min-h-screen lg:flex">
      <section className="flex-1 px-6 py-8 lg:px-10">
        <header className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Oasis Horizon
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Policy Terms
          </h1>
          <p className="text-slate-300">
            Read-only policy inquiry list for underwriters.
          </p>
        </header>

        <form className="mb-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-2 xl:grid-cols-5">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search policy # or insured"
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
          <input
            name="state"
            defaultValue={state}
            placeholder="State (e.g. CA)"
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
          <input
            name="status"
            defaultValue={status}
            placeholder="Status"
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
          <input
            name="exp_from"
            defaultValue={expFrom}
            type="date"
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <input
              name="exp_to"
              defaultValue={expTo}
              type="date"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
            >
              Search
            </button>
          </div>
        </form>

        <>
            <div className="mb-3 text-sm text-slate-400">
              Showing page {termPage.page + 1} of {Math.max(termPage.totalPages, 1)} (
              {termPage.totalElements} total)
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-900/70 text-left text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Policy</th>
                    <th className="px-4 py-3">Insured</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Term</th>
                    <th className="px-4 py-3">Expiration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {termPage.items.map((term) => (
                    <tr key={term.id} className="hover:bg-slate-900/70">
                      <td className="px-4 py-3">
                        <Link
                          href={`/policy-terms/${term.id}`}
                          className="font-medium text-sky-300 hover:text-sky-200"
                        >
                          {term.policyNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-200">{term.insuredName}</td>
                      <td className="px-4 py-3 text-slate-300">{term.status}</td>
                      <td className="px-4 py-3 text-slate-300">
                        #{term.termNumber} · {term.state}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {term.effectiveToDate}
                      </td>
                    </tr>
                  ))}
                  {termPage.items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-slate-400" colSpan={5}>
                        No policy terms matched your filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Link
                href={{ query: { ...searchParams, page: previousPage } }}
                className={`rounded-md px-3 py-2 text-sm ${
                  termPage.page === 0
                    ? "pointer-events-none bg-slate-800 text-slate-500"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                Previous
              </Link>
              <Link
                href={{ query: { ...searchParams, page: nextPage } }}
                className={`rounded-md px-3 py-2 text-sm ${
                  termPage.page >= termPage.totalPages - 1
                    ? "pointer-events-none bg-slate-800 text-slate-500"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                Next
              </Link>
            </div>
        </>
      </section>

      <AssistantDrawerToggle />
    </main>
  );
}
