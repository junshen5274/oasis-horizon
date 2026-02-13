"use client";

import { useState } from "react";

type AssistantTab = "search" | "summary";

const tabs: Array<{ id: AssistantTab; label: string }> = [
  { id: "search", label: "AI Search" },
  { id: "summary", label: "Policy Summary" }
];

export function AssistantDrawer() {
  const [activeTab, setActiveTab] = useState<AssistantTab>("search");

  return (
    <aside className="w-full border-t border-slate-800 bg-slate-900/60 p-4 lg:h-screen lg:w-[360px] lg:border-l lg:border-t-0 lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
          Assistant
        </h2>
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
            Natural language search controls will appear here in a future phase.
          </p>
        ) : (
          <p>Grounded policy summaries will appear here in a future phase.</p>
        )}
      </div>
    </aside>
  );
}
