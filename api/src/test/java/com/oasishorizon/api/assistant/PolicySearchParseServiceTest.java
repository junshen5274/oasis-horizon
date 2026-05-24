package com.oasishorizon.api.assistant;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.oasishorizon.api.assistant.dto.PolicySearchParseResponse;
import org.junit.jupiter.api.Test;

class PolicySearchParseServiceTest {
  private final PolicySearchParseService service = new PolicySearchParseService();

  @Test
  void parsesNyActivePrompt() {
    PolicySearchParseResponse response = service.parse("show all NY active policies");

    assertEquals("", response.q());
    assertEquals("NY", response.state());
    assertEquals("ACTIVE", response.status());
    assertEquals("expiration", response.date_field());
    assertEquals("", response.date_from());
    assertEquals("", response.date_to());
  }

  @Test
  void parsesCancelledPrompt() {
    PolicySearchParseResponse response = service.parse("find all CA policies, but cancelled");

    assertEquals("CA", response.state());
    assertEquals("CANCELLED", response.status());
  }

  @Test
  void parsesExpirationYearPrompt() {
    PolicySearchParseResponse response = service.parse("policies expiring in 2026");

    assertEquals("expiration", response.date_field());
    assertEquals("2026-01-01", response.date_from());
    assertEquals("2026-12-31", response.date_to());
  }

  @Test
  void parsesEffectiveYearPrompt() {
    PolicySearchParseResponse response = service.parse("policies effective in 2025");

    assertEquals("effective", response.date_field());
    assertEquals("2025-01-01", response.date_from());
    assertEquals("2025-12-31", response.date_to());
  }
}
