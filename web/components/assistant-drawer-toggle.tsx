"use client";

import { type SVGProps, useState } from "react";
import { AssistantDrawer } from "@/components/assistant-drawer";

function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
      <path d="M5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9L5 14z" />
    </svg>
  );
}

export function AssistantDrawerToggle() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const label = isDrawerOpen ? "Close Assistant" : "Open Assistant";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDrawerOpen((current) => !current)}
        title={label}
        aria-label={label}
        className="group fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/40 bg-sky-600 text-white shadow-lg shadow-sky-950/60 transition hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
      >
        <SparklesIcon className="h-5 w-5" aria-hidden="true" />
        <span className="pointer-events-none absolute -top-10 right-0 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-md transition group-hover:opacity-100 group-focus-visible:opacity-100">
          {label}
        </span>
      </button>

      <AssistantDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  );
}
