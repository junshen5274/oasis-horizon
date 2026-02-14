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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildQueryString } from "@/lib/query-string";

export type PolicyTermsUrlState = {
  q: string;
  state: string;
  status: string;
  date_field: "expiration" | "effective";
  date_from: string;
  date_to: string;
  page: number;
  size: number;
  sort: string;
};

type PolicyTermsFiltersProps = {
  params: PolicyTermsUrlState;
};

type FilterInputs = Pick<
  PolicyTermsUrlState,
  "q" | "state" | "status" | "date_field" | "date_from" | "date_to"
>;

function buildFiltersKey(filters: FilterInputs): string {
  return `${filters.q}|${filters.state}|${filters.status}|${filters.date_field}|${filters.date_from}|${filters.date_to}`;
}

export function PolicyTermsFilters({ params }: PolicyTermsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(params.q);
  const [stateFilter, setStateFilter] = useState(params.state);
  const [status, setStatus] = useState(params.status);
  const [dateField, setDateField] = useState<"expiration" | "effective">(
    params.date_field
  );
  const [dateFrom, setDateFrom] = useState(params.date_from);
  const [dateTo, setDateTo] = useState(params.date_to);

  const debounceTimerRef = useRef<number | null>(null);

  const appliedFilters = useMemo<FilterInputs>(
    () => ({
      q: params.q,
      state: params.state,
      status: params.status,
      date_field: params.date_field,
      date_from: params.date_from,
      date_to: params.date_to
    }),
    [
      params.date_field,
      params.date_from,
      params.date_to,
      params.q,
      params.state,
      params.status
    ]
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
      date_field: dateField,
      date_from: dateFrom,
      date_to: dateTo
    }),
    [dateField, dateFrom, dateTo, q, stateFilter, status]
  );

  const draftFiltersKey = useMemo(() => buildFiltersKey(draftFilters), [draftFilters]);

  const lastAppliedFiltersKeyRef = useRef(appliedFiltersKey);
  const isEditingRef = useRef(false);

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
    if (params.page !== 0 && debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      isEditingRef.current = false;
    }
  }, [params.page]);

  useEffect(() => {
    lastAppliedFiltersKeyRef.current = appliedFiltersKey;

    const shouldSyncInputs = !isEditingRef.current || draftFiltersKey === appliedFiltersKey;
    if (shouldSyncInputs) {
      setQ(appliedFilters.q);
      setStateFilter(appliedFilters.state);
      setStatus(appliedFilters.status);
      setDateField(appliedFilters.date_field);
      setDateFrom(appliedFilters.date_from);
      setDateTo(appliedFilters.date_to);
      isEditingRef.current = false;
    }
  }, [appliedFilters, appliedFiltersKey, draftFiltersKey]);

  const markEditing = useCallback(() => {
    isEditingRef.current = true;
  }, []);

  const activeFilters = [
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    stateFilter ? { key: "state", label: `State: ${stateFilter}` } : null,
    status ? { key: "status", label: `Status: ${status}` } : null,
    dateFrom || dateTo
      ? {
          key: "date_range",
          label: `${dateField === "effective" ? "Effective" : "Expiration"}: ${
            dateFrom || "…"
          } → ${dateTo || "…"}`
        }
      : null
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
          page: options.nextPage ?? (options.resetPage ? 0 : params.page),
          size: params.size,
          sort: params.sort
        });

        if (nextQuery === currentQuery) {
          if (options.forceRefreshIfUnchanged) {
            startTransition(() => {
              router.refresh();
            });
          }
          isEditingRef.current = false;
          return;
        }

        startTransition(() => {
          router.replace(nextQuery.length > 0 ? `${pathname}?${nextQuery}` : pathname);
        });
        isEditingRef.current = false;
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
    if (!isEditingRef.current) {
      return;
    }

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
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const hasFilterChanges = draftFiltersKey !== appliedFiltersKey;
    const urlPage = Number(searchParams.get("page") ?? params.page);

    applyFilters({
      immediate: true,
      resetPage: hasFilterChanges || urlPage !== 0,
      values: draftFilters,
      forceRefreshIfUnchanged: true
    });
  }

  function onClear() {
    const cleared: FilterInputs = {
      q: "",
      state: "",
      status: "",
      date_field: "expiration",
      date_from: "",
      date_to: ""
    };

    setQ("");
    setStateFilter("");
    setStatus("");
    setDateField("expiration");
    setDateFrom("");
    setDateTo("");

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
    if (filterKey === "date_range") {
      nextValues.date_field = "expiration";
      nextValues.date_from = "";
      nextValues.date_to = "";
      setDateField("expiration");
      setDateFrom("");
      setDateTo("");
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

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-7">
          <input
            value={q}
            onChange={(event) => {
              markEditing();
              setQ(event.target.value);
            }}
            placeholder="Search policy # or insured"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500 xl:col-span-2"
          />
          <input
            value={stateFilter}
            onChange={(event) => {
              markEditing();
              setStateFilter(event.target.value);
            }}
            placeholder="State (e.g. CA)"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <input
            value={status}
            onChange={(event) => {
              markEditing();
              setStatus(event.target.value);
            }}
            placeholder="Status"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <select
            value={dateField}
            onChange={(event) => {
              markEditing();
              setDateField(event.target.value === "effective" ? "effective" : "expiration");
            }}
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100"
            aria-label="Date field"
          >
            <option value="expiration">Date field: Expiration</option>
            <option value="effective">Date field: Effective</option>
          </select>
          <input
            value={dateFrom}
            onChange={(event) => {
              markEditing();
              setDateFrom(event.target.value);
            }}
            type="date"
            className="h-9 rounded-md border border-slate-700/90 bg-slate-950/80 px-3 text-sm text-slate-100"
          />
          <input
            value={dateTo}
            onChange={(event) => {
              markEditing();
              setDateTo(event.target.value);
            }}
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
