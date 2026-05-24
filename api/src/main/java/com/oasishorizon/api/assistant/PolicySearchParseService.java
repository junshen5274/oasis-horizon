package com.oasishorizon.api.assistant;

import com.oasishorizon.api.assistant.dto.PolicySearchParseResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class PolicySearchParseService {
  private static final Pattern YEAR_PATTERN = Pattern.compile("\\b(19|20)\\d{2}\\b");
  private static final Set<String> ALLOWED_STATES =
      Set.of("CA", "NY", "TX", "FL", "IL", "WA", "OR", "AZ", "CO", "GA");
  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

  public PolicySearchParseResponse parse(String prompt) {
    String normalized = prompt.trim();
    String lower = normalized.toLowerCase(Locale.US);

    String state = parseState(normalized);
    String status = parseStatus(lower);
    String dateField = parseDateField(lower);
    LocalDateRange range = parseYearRange(lower);

    return new PolicySearchParseResponse(
        "",
        state,
        status,
        dateField,
        range.dateFrom() == null ? "" : range.dateFrom().format(DATE_FORMATTER),
        range.dateTo() == null ? "" : range.dateTo().format(DATE_FORMATTER));
  }

  private String parseState(String prompt) {
    for (String token : prompt.split("[^A-Za-z]+")) {
      if (token.length() == 2) {
        String upper = token.toUpperCase(Locale.US);
        if (ALLOWED_STATES.contains(upper)) {
          return upper;
        }
      }
    }
    return "";
  }

  private String parseStatus(String promptLower) {
    if (promptLower.contains("non-renewed") || promptLower.contains("non renewed")) {
      return "NON_RENEWED";
    }
    if (promptLower.contains("cancelled") || promptLower.contains("canceled")) {
      return "CANCELLED";
    }
    if (promptLower.contains("expired")) {
      return "EXPIRED";
    }
    if (promptLower.contains("active")) {
      return "ACTIVE";
    }
    return "";
  }

  private String parseDateField(String promptLower) {
    if (promptLower.contains("effective")
        || promptLower.contains("starts")
        || promptLower.contains("starting")) {
      return "effective";
    }
    return "expiration";
  }

  private LocalDateRange parseYearRange(String promptLower) {
    Matcher matcher = YEAR_PATTERN.matcher(promptLower);
    if (!matcher.find()) {
      return new LocalDateRange(null, null);
    }
    int year = Integer.parseInt(matcher.group());
    return new LocalDateRange(LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31));
  }

  private record LocalDateRange(LocalDate dateFrom, LocalDate dateTo) {}
}
