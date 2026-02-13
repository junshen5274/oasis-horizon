"use client";

import { useState } from "react";
import { AssistantDrawer } from "@/components/assistant-drawer";

export function AssistantDrawerToggle() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDrawerOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-40 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-sky-500"
      >
        {isDrawerOpen ? "Close Assistant" : "Open Assistant"}
      </button>

      <AssistantDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  );
}
