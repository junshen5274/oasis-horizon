import Link from "next/link";
import { AssistantDrawerToggle } from "@/components/assistant-drawer-toggle";
import { fetchPolicyTerms, type PolicyTermSearchParams } from "@/lib/api";
import { buildQueryString } from "@/lib/query-string";
import {
  PolicyTermsFilters,
  type PolicyTermsUrlState
} from "./_components/policy-terms-filters";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParams, key: string): string {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parseNonNegativeInt(raw: string, fallback: number): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function parseUrlState(searchParams: SearchParams): PolicyTermsUrlState {
  return {
    q: getParam(searchParams, "q"),
    state: getParam(searchParams, "state"),
    status: getParam(searchParams, "status"),
    exp_from: getParam(searchParams, "exp_from"),
    exp_to: getParam(searchParams, "exp_to"),
    page: parseNonNegativeInt(getParam(searchParams, "page"), 0),
    size: parseNonNegativeInt(getParam(searchParams, "size"), 20),
    sort: getParam(searchParams, "sort") || "effective_to_date,asc"
  };
}

function buildPageHref(params: PolicyTermsUrlState, page: number): string {
  const query = buildQueryString({
    q: params.q,
    state: params.state,
    status: params.status,
    exp_from: params.exp_from,
    exp_to: params.exp_to,
    page,
    size: params.size,
    sort: params.sort
  });

  return query.length > 0 ? `/policy-terms?${query}` : "/policy-terms";
}

export default async function PolicyTermsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const urlState = parseUrlState(searchParams);

  const filters: PolicyTermSearchParams = {
    q: urlState.q,
    state: urlState.state,
    status: urlState.status,
    exp_from: urlState.exp_from,
    exp_to: urlState.exp_to,
    page: urlState.page,
    size: urlState.size,
    sort: urlState.sort
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

          <PolicyTermsFilters params={urlState} />

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
  const hasPreviousPage = termPage.page > 0;
  const hasNextPage = (termPage.page + 1) * termPage.size < termPage.totalElements;
  const previousPage = Math.max(termPage.page - 1, 0);
  const nextPage = termPage.page + 1;

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

        <PolicyTermsFilters params={urlState} />

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
              href={buildPageHref(urlState, previousPage)}
              className={`rounded-md px-3 py-2 text-sm ${
                hasPreviousPage
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "pointer-events-none bg-slate-800 text-slate-500"
              }`}
            >
              Previous
            </Link>
            <Link
              href={buildPageHref(urlState, nextPage)}
              className={`rounded-md px-3 py-2 text-sm ${
                hasNextPage
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "pointer-events-none bg-slate-800 text-slate-500"
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
