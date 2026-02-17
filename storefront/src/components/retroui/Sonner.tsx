"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "border-2 border-ink rounded shadow-hard-sm bg-paper text-ink font-sans",
          title: "font-head font-medium",
          description: "text-ink/70",
          actionButton:
            "bg-ink text-paper font-head px-3 py-1 rounded border-2 border-ink",
          cancelButton:
            "bg-transparent text-ink font-head px-3 py-1 rounded border-2 border-ink",
        },
      }}
    />
  );
}
