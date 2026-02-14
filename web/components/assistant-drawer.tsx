"use client";

import { useEffect, useState } from "react";

type AssistantTab = "search" | "summary";

const tabs: Array<{ id: AssistantTab; label: string }> = [
  { id: "search", label: "AI Search" },
  { id: "summary", label: "Policy Summary" }
];

type AssistantDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AssistantDrawer({ open, onOpenChange }: AssistantDrawerProps) {
  const [activeTab, setActiveTab] = useState<AssistantTab>("search");

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

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
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
            <p>
              Natural language search controls will appear here in a future
              phase.
            </p>
          ) : (
            <p>Grounded policy summaries will appear here in a future phase.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
