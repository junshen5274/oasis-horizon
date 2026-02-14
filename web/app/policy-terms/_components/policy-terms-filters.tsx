"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { buildQueryString } from "@/lib/query-string";

export type PolicyTermsUrlState = {
  q: string;
  state: string;
  status: string;
  exp_from: string;
  exp_to: string;
  page: number;
  size: number;
  sort: string;
};

type PolicyTermsFiltersProps = {
  params: PolicyTermsUrlState;
};

export function PolicyTermsFilters({ params }: PolicyTermsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(params.q);
  const [stateFilter, setStateFilter] = useState(params.state);
  const [status, setStatus] = useState(params.status);
  const [expFrom, setExpFrom] = useState(params.exp_from);
  const [expTo, setExpTo] = useState(params.exp_to);

  useEffect(() => {
    setQ(params.q);
    setStateFilter(params.state);
    setStatus(params.status);
    setExpFrom(params.exp_from);
    setExpTo(params.exp_to);
  }, [params]);

  const activeFilters = [
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    stateFilter ? { key: "state", label: `State: ${stateFilter}` } : null,
    status ? { key: "status", label: `Status: ${status}` } : null,
    expFrom ? { key: "exp_from", label: `Expires from: ${expFrom}` } : null,
    expTo ? { key: "exp_to", label: `Expires to: ${expTo}` } : null
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip));

  function navigate(nextParams: PolicyTermsUrlState) {
    const query = buildQueryString({
      q: nextParams.q,
      state: nextParams.state,
      status: nextParams.status,
      exp_from: nextParams.exp_from,
      exp_to: nextParams.exp_to,
      page: nextParams.page,
      size: nextParams.size,
      sort: nextParams.sort
    });

    startTransition(() => {
      router.push(query.length > 0 ? `${pathname}?${query}` : pathname);
    });
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({
      q,
      state: stateFilter,
      status,
      exp_from: expFrom,
      exp_to: expTo,
      page: 0,
      size: params.size,
      sort: params.sort
    });
  }

  function onClear() {
    setQ("");
    setStateFilter("");
    setStatus("");
    setExpFrom("");
    setExpTo("");

    navigate({
      q: "",
      state: "",
      status: "",
      exp_from: "",
      exp_to: "",
      page: 0,
      size: 20,
      sort: "effective_to_date,asc"
    });
  }

  function removeFilter(filterKey: string) {
    const next = {
      q,
      state: stateFilter,
      status,
      exp_from: expFrom,
      exp_to: expTo,
      page: 0,
      size: params.size,
      sort: params.sort
    };

    if (filterKey === "q") {
      next.q = "";
      setQ("");
    }
    if (filterKey === "state") {
      next.state = "";
      setStateFilter("");
    }
    if (filterKey === "status") {
      next.status = "";
      setStatus("");
    }
    if (filterKey === "exp_from") {
      next.exp_from = "";
      setExpFrom("");
    }
    if (filterKey === "exp_to") {
      next.exp_to = "";
      setExpTo("");
    }

    navigate(next);
  }

  return (
    <>
      <form
        onSubmit={onSearch}
        className="mb-2 space-y-3 rounded-xl border border-slate-800/80 bg-slate-900/30 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            Filters
          </p>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="h-10 rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-900"
            >
              Search
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={isPending}
              className="h-10 rounded-md border border-slate-700 px-4 text-sm text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search policy # or insured"
            className="h-10 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500 xl:col-span-2"
          />
          <input
            value={stateFilter}
            onChange={(event) => setStateFilter(event.target.value)}
            placeholder="State (e.g. CA)"
            className="h-10 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <input
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            placeholder="Status"
            className="h-10 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <input
            value={expFrom}
            onChange={(event) => setExpFrom(event.target.value)}
            type="date"
            className="h-10 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100"
          />
          <input
            value={expTo}
            onChange={(event) => setExpTo(event.target.value)}
            type="date"
            className="h-10 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100"
          />
        </div>

        <p className="text-xs text-slate-500">
          Search by policy number, insured name. Use dates to filter expiration range.
        </p>
      </form>

      {activeFilters.length > 0 ? (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Active filters
          </span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => removeFilter(filter.key)}
              className="rounded-full border border-slate-700/90 bg-slate-900/90 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
            >
              {filter.label} ×
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-rose-700/60 bg-rose-950/40 px-3 py-1 text-xs text-rose-200 hover:bg-rose-900/40"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </>
  );
}
