function getStatusBadgeClass(status: string): string {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === "ACTIVE") {
    return "border-emerald-700/60 bg-emerald-950/50 text-emerald-200";
  }

  if (normalizedStatus === "EXPIRED") {
    return "border-slate-700 bg-slate-800/70 text-slate-300";
  }

  if (normalizedStatus === "CANCELLED" || normalizedStatus === "CANCELED") {
    return "border-rose-700/60 bg-rose-950/50 text-rose-200";
  }

  if (normalizedStatus === "NON_RENEWED") {
    return "border-amber-700/60 bg-amber-950/50 text-amber-200";
  }

  return "border-slate-700 bg-slate-900 text-slate-300";
}

export function PolicyStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex min-w-24 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(
        status
      )}`}
    >
      {status}
    </span>
  );
}
