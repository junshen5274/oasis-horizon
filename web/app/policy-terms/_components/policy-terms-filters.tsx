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
        className="mb-3 grid gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-2 xl:grid-cols-5"
      >
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search policy # or insured"
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <input
          value={stateFilter}
          onChange={(event) => setStateFilter(event.target.value)}
          placeholder="State (e.g. CA)"
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <input
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          placeholder="Status"
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <input
          value={expFrom}
          onChange={(event) => setExpFrom(event.target.value)}
          type="date"
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            value={expTo}
            onChange={(event) => setExpTo(event.target.value)}
            type="date"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-900"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Clear
          </button>
        </div>
      </form>

      {activeFilters.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => removeFilter(filter.key)}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
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
