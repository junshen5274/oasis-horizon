package com.oasishorizon.api.policy;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

@WebMvcTest(PolicyTermController.class)
class PolicyTermControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private PolicyTermService policyTermService;

  @Test
  void listPolicyTermsReturnsBadRequestWhenExpirationDateRangeIsInvalid() throws Exception {
    mockMvc
        .perform(get("/api/policy-terms").param("exp_from", "2025-12-31").param("exp_to", "2025-01-01"))
        .andExpect(status().isBadRequest())
        .andExpect(
            result -> {
              ResponseStatusException exception =
                  (ResponseStatusException) result.getResolvedException();
              assertThat(exception.getReason())
                  .isEqualTo("exp_from must be <= exp_to");
            });
  }

  @Test
  void listPolicyTermsReturnsBadRequestWhenEffectiveDateRangeIsInvalid() throws Exception {
    mockMvc
        .perform(get("/api/policy-terms").param("eff_from", "2025-12-31").param("eff_to", "2025-01-01"))
        .andExpect(status().isBadRequest())
        .andExpect(
            result -> {
              ResponseStatusException exception =
                  (ResponseStatusException) result.getResolvedException();
              assertThat(exception.getReason())
                  .isEqualTo("eff_from must be <= eff_to");
            });
  }

  @Test
  void listPolicyTermsAppliesEffectiveRangeFilterParameters() throws Exception {
    LocalDate effFrom = LocalDate.of(2025, 1, 1);
    LocalDate effTo = LocalDate.of(2025, 12, 31);
    when(policyTermService.search(any(), any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(new PageImpl<>(List.of(createPolicyTerm(effFrom, effTo))));

    mockMvc
        .perform(
            get("/api/policy-terms")
                .param("eff_from", "2025-01-01")
                .param("eff_to", "2025-12-31"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items.length()").value(1))
        .andExpect(jsonPath("$.items[0].effectiveFromDate").value("2025-01-01"));

    verify(policyTermService)
        .search(
            eq(Optional.empty()),
            eq(Optional.empty()),
            eq(Optional.empty()),
            eq(Optional.of(effFrom)),
            eq(Optional.of(effTo)),
            eq(Optional.empty()),
            eq(Optional.empty()),
            eq(PageRequest.of(0, 20, Sort.by(new Sort.Order(Sort.Direction.ASC, "effectiveToDate")))));
  }

  private PolicyTerm createPolicyTerm(LocalDate effectiveFromDate, LocalDate effectiveToDate) {
    Instant now = Instant.parse("2025-01-01T00:00:00Z");
    Policy policy =
        new Policy(UUID.randomUUID(), "POL-10001", "Acme Inc", now, now);
    return new PolicyTerm(
        UUID.randomUUID(),
        policy,
        1,
        "CA",
        "Active",
        effectiveFromDate,
        effectiveToDate,
        new BigDecimal("100.00"),
        LocalDate.of(2025, 2, 1),
        LocalDate.of(2025, 1, 15),
        now,
        now);
  }
}
