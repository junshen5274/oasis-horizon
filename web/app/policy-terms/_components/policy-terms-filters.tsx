"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition
} from "react";
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

type FilterInputs = Pick<
  PolicyTermsUrlState,
  "q" | "state" | "status" | "exp_from" | "exp_to"
>;

function buildFiltersKey(filters: FilterInputs): string {
  return `${filters.q}|${filters.state}|${filters.status}|${filters.exp_from}|${filters.exp_to}`;
}

export function PolicyTermsFilters({ params }: PolicyTermsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(params.q);
  const [stateFilter, setStateFilter] = useState(params.state);
  const [status, setStatus] = useState(params.status);
  const [expFrom, setExpFrom] = useState(params.exp_from);
  const [expTo, setExpTo] = useState(params.exp_to);

  const debounceTimerRef = useRef<number | null>(null);

  const appliedFilters = useMemo<FilterInputs>(
    () => ({
      q: params.q,
      state: params.state,
      status: params.status,
      exp_from: params.exp_from,
      exp_to: params.exp_to
    }),
    [params.exp_from, params.exp_to, params.q, params.state, params.status]
  );

  const appliedFiltersKey = useMemo(
    () => buildFiltersKey(appliedFilters),
    [appliedFilters]
  );

  const draftFilters = useMemo<FilterInputs>(
    () => ({
      q,
      state: stateFilter,
      status,
      exp_from: expFrom,
      exp_to: expTo
    }),
    [expFrom, expTo, q, stateFilter, status]
  );

  const draftFiltersKey = useMemo(() => buildFiltersKey(draftFilters), [draftFilters]);

  const lastAppliedFiltersKeyRef = useRef(appliedFiltersKey);

  const currentQuery = useMemo(
    () =>
      buildQueryString({
        ...appliedFilters,
        page: params.page,
        size: params.size,
        sort: params.sort
      }),
    [appliedFilters, params.page, params.size, params.sort]
  );

  useEffect(() => {
    lastAppliedFiltersKeyRef.current = appliedFiltersKey;
    setQ(appliedFilters.q);
    setStateFilter(appliedFilters.state);
    setStatus(appliedFilters.status);
    setExpFrom(appliedFilters.exp_from);
    setExpTo(appliedFilters.exp_to);
  }, [appliedFilters, appliedFiltersKey]);

  const activeFilters = [
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    stateFilter ? { key: "state", label: `State: ${stateFilter}` } : null,
    status ? { key: "status", label: `Status: ${status}` } : null,
    expFrom ? { key: "exp_from", label: `Expires from: ${expFrom}` } : null,
    expTo ? { key: "exp_to", label: `Expires to: ${expTo}` } : null
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip));

  const applyFilters = useCallback(
    (options: {
      immediate: boolean;
      resetPage: boolean;
      values?: FilterInputs;
      nextPage?: number;
      forceRefreshIfUnchanged?: boolean;
    }) => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      const nextValues: FilterInputs = options.values ?? draftFilters;

      const runApply = () => {
        const nextQuery = buildQueryString({
          ...nextValues,
          page:
            options.nextPage ??
            (options.resetPage ? 0 : params.page),
          size: params.size,
          sort: params.sort
        });

        if (nextQuery === currentQuery) {
          if (options.forceRefreshIfUnchanged) {
            startTransition(() => {
              router.refresh();
            });
          }
          return;
        }

        startTransition(() => {
          router.replace(nextQuery.length > 0 ? `${pathname}?${nextQuery}` : pathname);
        });
      };

      if (options.immediate) {
        runApply();
        return;
      }

      debounceTimerRef.current = window.setTimeout(() => {
        runApply();
        debounceTimerRef.current = null;
      }, 400);
    },
    [currentQuery, draftFilters, params.page, params.size, params.sort, pathname, router]
  );

  useEffect(() => {
    if (draftFiltersKey === lastAppliedFiltersKeyRef.current) {
      return;
    }

    applyFilters({
      immediate: false,
      resetPage: true,
      values: draftFilters
    });
  }, [applyFilters, draftFilters, draftFiltersKey]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters({
      immediate: true,
      resetPage: true,
      values: draftFilters,
      forceRefreshIfUnchanged: true
    });
  }

  function onClear() {
    const cleared: FilterInputs = {
      q: "",
      state: "",
      status: "",
      exp_from: "",
      exp_to: ""
    };

    setQ("");
    setStateFilter("");
    setStatus("");
    setExpFrom("");
    setExpTo("");

    applyFilters({ immediate: true, resetPage: true, values: cleared });
  }

  function removeFilter(filterKey: string) {
    const nextValues: FilterInputs = {
      ...draftFilters
    };

    if (filterKey === "q") {
      nextValues.q = "";
      setQ("");
    }
    if (filterKey === "state") {
      nextValues.state = "";
      setStateFilter("");
    }
    if (filterKey === "status") {
      nextValues.status = "";
      setStatus("");
    }
    if (filterKey === "exp_from") {
      nextValues.exp_from = "";
      setExpFrom("");
    }
    if (filterKey === "exp_to") {
      nextValues.exp_to = "";
      setExpTo("");
    }

    applyFilters({ immediate: true, resetPage: true, values: nextValues });
  }

  return (
    <>
      <form
        onSubmit={onSearch}
        className="mb-2 space-y-2 rounded-xl border border-slate-800/80 bg-slate-900/30 p-3"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            Filters
          </p>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="h-9 rounded-md bg-sky-600 px-3 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-900"
            >
              {isPending ? "Searching..." : "Search"}
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={isPending}
              className="h-9 rounded-md border border-slate-700 px-3 text-sm text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search policy # or insured"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500 xl:col-span-2"
          />
          <input
            value={stateFilter}
            onChange={(event) => setStateFilter(event.target.value)}
            placeholder="State (e.g. CA)"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <input
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            placeholder="Status"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <input
            value={expFrom}
            onChange={(event) => setExpFrom(event.target.value)}
            type="date"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100"
          />
          <input
            value={expTo}
            onChange={(event) => setExpTo(event.target.value)}
            type="date"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100"
          />
        </div>
      </form>

      {activeFilters.length > 0 ? (
        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Active filters
          </span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => removeFilter(filter.key)}
              className="rounded-full border border-slate-700/90 bg-slate-900/90 px-2.5 py-0.5 text-[11px] text-slate-200 hover:bg-slate-800"
            >
              {filter.label} ×
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-rose-700/60 bg-rose-950/40 px-2.5 py-0.5 text-[11px] text-rose-200 hover:bg-rose-900/40"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </>
  );
}
