export type ParsedPolicySearchFilters = {
  q: string;
  state: string;
  status: string;
  date_field: "effective" | "expiration";
  date_from: string;
  date_to: string;
};

const STATE_CODES = new Set(["CA", "NY", "TX", "FL", "IL", "WA", "OR", "AZ", "CO", "GA"]);

function detectState(input: string): string {
  const tokens = input.match(/[A-Za-z]{2,}/g) ?? [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const normalized = token.toUpperCase();

    if (!STATE_CODES.has(normalized)) {
      continue;
    }

    const previous = tokens[index - 1]?.toLowerCase();
    const isClearlyCode = token === normalized;
    const followsStateHint = previous === "state" || previous === "in" || previous === "for";

    if (isClearlyCode || followsStateHint) {
      return normalized;
    }
  }

  return "";
}

function detectStatus(normalizedInput: string): string {
  if (/\bnon[\s-]?renewed\b/.test(normalizedInput)) {
    return "NON_RENEWED";
  }
  if (/\bcancell?ed\b/.test(normalizedInput)) {
    return "CANCELLED";
  }
  if (/\bexpired\b/.test(normalizedInput)) {
    return "EXPIRED";
  }
  if (/\bactive\b/.test(normalizedInput)) {
    return "ACTIVE";
  }

  return "";
}

function detectDateField(normalizedInput: string): "effective" | "expiration" {
  if (/\b(effective|starts|starting)\b/.test(normalizedInput)) {
    return "effective";
  }
  return "expiration";
}

function detectYear(input: string): string {
  return input.match(/\b(19|20)\d{2}\b/)?.[0] ?? "";
}

export function parsePolicySearchPrompt(input: string): ParsedPolicySearchFilters {
  const prompt = input.trim();
  const normalizedInput = prompt.toLowerCase();
  const state = detectState(prompt);
  const status = detectStatus(normalizedInput);
  const dateField = detectDateField(normalizedInput);
  const year = detectYear(prompt);
  const dateFrom = year ? `${year}-01-01` : "";
  const dateTo = year ? `${year}-12-31` : "";
  const hasStructuredFilters = Boolean(state || status || year);

  return {
    q: hasStructuredFilters ? "" : prompt,
    state,
    status,
    date_field: dateField,
    date_from: dateFrom,
    date_to: dateTo
  };
}
