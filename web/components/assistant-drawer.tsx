"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  parsePolicySearchPrompt,
  type ParsedPolicySearchFilters
} from "@/lib/policy-search-parser";
import { buildQueryString } from "@/lib/query-string";

type AssistantTab = "search" | "summary";

const tabs: Array<{ id: AssistantTab; label: string }> = [
  { id: "search", label: "AI Search" },
  { id: "summary", label: "Policy Summary" }
];

type AssistantDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policySummaryContext?: PolicySummaryContext;
};

export type PolicySummaryContext = {
  policyNumber: string;
  insuredName: string;
  termNumber: number;
  state: string;
  status: string;
  effectiveFromDate: string;
  effectiveToDate: string;
  balanceDue: string;
  nextDueDate: string | null;
  lastPaymentDate: string | null;
};

function displayValue(value: string | null): string {
  return value && value.trim().length > 0 ? value : "Not available";
}

function PolicySummary({
  policy
}: {
  policy?: PolicySummaryContext;
}) {
  if (!policy) {
    return (
      <p className="text-slate-300">
        Open a policy term detail page to generate a policy summary.
      </p>
    );
  }

  const summaryRows = [
    { label: "Policy", value: policy.policyNumber },
    { label: "Insured", value: policy.insuredName },
    { label: "Term", value: `#${policy.termNumber}` },
    { label: "State", value: policy.state },
    { label: "Status", value: policy.status },
    { label: "Effective", value: policy.effectiveFromDate },
    { label: "Expiration", value: policy.effectiveToDate },
    { label: "Balance due", value: `$${policy.balanceDue}` },
    { label: "Next due", value: displayValue(policy.nextDueDate) },
    { label: "Last payment", value: displayValue(policy.lastPaymentDate) }
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-slate-200">
          Policy {policy.policyNumber} is term #{policy.termNumber} for{" "}
          {policy.insuredName} in {policy.state}. The term status is {policy.status}.
        </p>
        <p className="text-slate-300">
          The term runs from {policy.effectiveFromDate} through{" "}
          {policy.effectiveToDate}. The current balance due is ${policy.balanceDue}.
        </p>
        <p className="text-slate-300">
          Next due date: {displayValue(policy.nextDueDate)}. Last payment date:{" "}
          {displayValue(policy.lastPaymentDate)}.
        </p>
      </div>

      <dl className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-900/70 px-3">
        {summaryRows.map((row) => (
          <div key={row.label} className="grid grid-cols-[110px_1fr] gap-3 py-2">
            <dt className="text-slate-500">{row.label}</dt>
            <dd className="font-medium text-slate-200">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function AssistantDrawer({
  open,
  onOpenChange,
  policySummaryContext
}: AssistantDrawerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AssistantTab>("search");
  const [mounted, setMounted] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [parsedFilters, setParsedFilters] = useState<ParsedPolicySearchFilters | null>(
    null
  );

  const previewRows = useMemo(() => {
    if (!parsedFilters) {
      return [];
    }

    return [
      { label: "Keyword", value: parsedFilters.q || "Any" },
      { label: "State", value: parsedFilters.state || "Any" },
      { label: "Status", value: parsedFilters.status || "Any" },
      {
        label: "Date field",
        value: parsedFilters.date_field === "effective" ? "Effective" : "Expiration"
      },
      { label: "Date from", value: parsedFilters.date_from || "Any" },
      { label: "Date to", value: parsedFilters.date_to || "Any" }
    ];
  }, [parsedFilters]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!mounted || !open) {
    return null;
  }

  function onPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setParsedFilters(parsePolicySearchPrompt(searchPrompt));
  }

  function onApplyFilters() {
    if (!parsedFilters) {
      return;
    }

    const query = buildQueryString({
      q: parsedFilters.q,
      state: parsedFilters.state,
      status: parsedFilters.status,
      date_field: parsedFilters.date_field,
      date_from: parsedFilters.date_from,
      date_to: parsedFilters.date_to,
      page: 0
    });

    router.push(query ? `/policy-terms?${query}` : "/policy-terms");
    onOpenChange(false);
  }

  return createPortal(
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close Assistant"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-slate-950/70"
      />
      <aside className="fixed right-0 top-0 h-screen w-full border-l border-slate-800 bg-slate-900 p-4 shadow-2xl sm:max-w-[420px] sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            Assistant
          </h2>
          <button
            type="button"
            aria-label="Close assistant panel"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-2 text-slate-300 hover:bg-slate-800"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="mb-4 flex gap-2 rounded-lg bg-slate-800/80 p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-sky-500/20 text-sky-200"
                    : "text-slate-300 hover:bg-slate-700/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          {activeTab === "search" ? (
            <form onSubmit={onPreview} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="assistant-policy-search"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Natural language search
                </label>
                <textarea
                  id="assistant-policy-search"
                  value={searchPrompt}
                  onChange={(event) => setSearchPrompt(event.target.value)}
                  rows={4}
                  placeholder="Show active CA policies expiring in 2026"
                  className="w-full resize-none rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
              >
                Parse / Preview
              </button>

              {parsedFilters ? (
                <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Parsed filters
                    </p>
                    <dl className="mt-2 divide-y divide-slate-800">
                      {previewRows.map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-[110px_1fr] gap-3 py-2"
                        >
                          <dt className="text-slate-500">{row.label}</dt>
                          <dd className="font-medium text-slate-200">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <button
                    type="button"
                    onClick={onApplyFilters}
                    className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                  >
                    Apply Filters
                  </button>
                </div>
              ) : null}
            </form>
          ) : (
            <PolicySummary policy={policySummaryContext} />
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}
