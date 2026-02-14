import { parseNonNegativeInt, parsePositiveInt } from "@/lib/query";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type PolicyTermSummary = {
  id: string;
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

export type PolicyTermPage = {
  items: PolicyTermSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type PolicyTermDetail = PolicyTermSummary & {
  createdAt: string;
  updatedAt: string;
};

export type PolicyTermSearchParams = {
  q?: string;
  state?: string;
  status?: string;
  exp_from?: string;
  exp_to?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export type ApiError = {
  kind: "network" | "http";
  message: string;
  status?: number;
};

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: ApiError;
    };

async function fetchJson<T>(
  path: string,
  params?: Record<string, string>
): Promise<ApiResult<T>> {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value.trim().length > 0) {
        url.searchParams.set(key, value);
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store"
    });

    if (!response.ok) {
      return {
        ok: false,
        error: {
          kind: "http",
          status: response.status,
          message: `Unable to load data right now (HTTP ${response.status}).`
        }
      };
    }

    return {
      ok: true,
      data: (await response.json()) as T
    };
  } catch {
    return {
      ok: false,
      error: {
        kind: "network",
        message:
          "Unable to connect to the Policy API. Please try again in a moment."
      }
    };
  }
}

export async function fetchPolicyTerms(
  params: PolicyTermSearchParams = {}
): Promise<ApiResult<PolicyTermPage>> {
  const requestParams: Record<string, string> = {
    page: String(parseNonNegativeInt(params.page, 0)),
    size: String(parsePositiveInt(params.size, 20)),
    sort: params.sort ?? "effective_to_date,asc"
  };

  if (params.q) requestParams.q = params.q;
  if (params.state) requestParams.state = params.state;
  if (params.status) requestParams.status = params.status;
  if (params.exp_from) requestParams.exp_from = params.exp_from;
  if (params.exp_to) requestParams.exp_to = params.exp_to;

  return fetchJson<PolicyTermPage>("/api/policy-terms", requestParams);
}

export async function fetchPolicyTerm(
  termId: string
): Promise<ApiResult<PolicyTermDetail>> {
  return fetchJson<PolicyTermDetail>(`/api/policy-terms/${termId}`);
}
