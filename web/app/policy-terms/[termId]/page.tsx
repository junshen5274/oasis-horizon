import type { ReactNode } from "react";
import Link from "next/link";
import { AssistantDrawerToggle } from "@/components/assistant-drawer-toggle";
import { PolicyStatusBadge } from "@/components/policy-status-badge";
import { fetchPolicyTerm, type PolicyTermDetail } from "@/lib/api";

function displayValue(value: string | null): string {
  return value && value.trim().length > 0 ? value : "Not available";
}

function formatDate(value: string): string {
  return value.slice(0, 10);
}

function DetailSection({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function DetailField({
  label,
  value
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.15em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-100">{value}</dd>
    </div>
  );
}

function DetailFieldGrid({ children }: { children: ReactNode }) {
  return <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</dl>;
}

function PolicyDetailContent({ policy }: { policy: PolicyTermDetail }) {
  return (
    <>
      <header className="mb-6 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Policy Detail
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              {policy.policyNumber}
            </h1>
            <p className="mt-1 text-slate-300">{policy.insuredName}</p>
          </div>
          <PolicyStatusBadge status={policy.status} />
        </div>
      </header>

      <div className="grid gap-5">
        <DetailSection title="Policy Overview">
          <DetailFieldGrid>
            <DetailField label="Policy Number" value={policy.policyNumber} />
            <DetailField label="Insured Name" value={policy.insuredName} />
            <DetailField label="Status" value={<PolicyStatusBadge status={policy.status} />} />
            <DetailField label="State" value={policy.state} />
            <DetailField label="Term Number" value={`#${policy.termNumber}`} />
          </DetailFieldGrid>
        </DetailSection>

        <DetailSection title="Term Dates">
          <DetailFieldGrid>
            <DetailField label="Effective Date" value={policy.effectiveFromDate} />
            <DetailField label="Expiration Date" value={policy.effectiveToDate} />
          </DetailFieldGrid>
        </DetailSection>

        <DetailSection
          title="Policy / Billing Info"
          description="Fields currently returned by the read-only policy term API."
        >
          <DetailFieldGrid>
            <DetailField label="Balance Due" value={`$${policy.balanceDue}`} />
            <DetailField label="Next Due Date" value={displayValue(policy.nextDueDate)} />
            <DetailField
              label="Last Payment Date"
              value={displayValue(policy.lastPaymentDate)}
            />
            <DetailField label="Created" value={formatDate(policy.createdAt)} />
            <DetailField label="Updated" value={formatDate(policy.updatedAt)} />
          </DetailFieldGrid>
        </DetailSection>

        <DetailSection title="Prototype Notes">
          <p className="text-sm leading-6 text-slate-300">
            This v1 prototype includes policy term details, simple fake billing fields,
            and record timestamps. Claims, endorsements, rating details, billing
            transactions, payment actions, and full underwriting file data are not
            available in the prototype dataset.
          </p>
        </DetailSection>
      </div>
    </>
  );
}

export default async function PolicyTermDetailPage({
  params
}: {
  params: { termId: string };
}) {
  const result = await fetchPolicyTerm(params.termId);

  return (
    <main className="min-h-screen">
      <section className="flex-1 px-6 py-8 lg:px-10">
        <Link
          href="/policy-terms"
          className="mb-6 inline-flex text-sm text-sky-300 hover:text-sky-200"
        >
          ← Back to Policy Terms
        </Link>

        {result.ok ? (
          <PolicyDetailContent policy={result.data} />
        ) : (
          <div className="rounded-xl border border-amber-700/40 bg-amber-950/30 p-4 text-sm text-amber-100">
            <p className="font-medium">
              {result.error.status === 404
                ? "Policy detail was not found."
                : "Policy detail is temporarily unavailable."}
            </p>
            <p className="mt-1 text-amber-200/90">{result.error.message}</p>
          </div>
        )}
      </section>

      <AssistantDrawerToggle
        policySummaryContext={result.ok ? result.data : undefined}
      />
    </main>
  );
}
