package com.oasishorizon.api.policy;

import com.oasishorizon.api.policy.dto.PolicyTermDetailResponse;
import com.oasishorizon.api.policy.dto.PolicyTermPageResponse;
import com.oasishorizon.api.policy.dto.PolicyTermSummaryResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/policy-terms")
@Validated
public class PolicyTermController {
  private static final Map<String, String> SORT_FIELDS =
      Map.of(
          "effective_to_date",
          "effectiveToDate",
          "effective_from_date",
          "effectiveFromDate",
          "policy_number",
          "policy.policyNumber",
          "insured_name",
          "policy.insuredName",
          "state",
          "state",
          "status",
          "status",
          "term_number",
          "termNumber");

  private final PolicyTermService policyTermService;

  public PolicyTermController(PolicyTermService policyTermService) {
    this.policyTermService = policyTermService;
  }

  @GetMapping
  public PolicyTermPageResponse listPolicyTerms(
      @RequestParam(name = "q", required = false) String query,
      @RequestParam(name = "state", required = false) String state,
      @RequestParam(name = "status", required = false) String status,
      @RequestParam(name = "exp_from", required = false)
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate expFrom,
      @RequestParam(name = "exp_to", required = false)
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate expTo,
      @RequestParam(defaultValue = "0") @Min(0) int page,
      @RequestParam(defaultValue = "20") @Min(1) @Max(200) int size,
      @RequestParam(defaultValue = "effective_to_date,asc") String sort) {
    Sort sortSpec = parseSort(sort);
    PageRequest pageRequest = PageRequest.of(page, size, sortSpec);
    Page<PolicyTerm> result =
        policyTermService.search(
            Optional.ofNullable(query),
            Optional.ofNullable(state),
            Optional.ofNullable(status),
            Optional.ofNullable(expFrom),
            Optional.ofNullable(expTo),
            pageRequest);

    return new PolicyTermPageResponse(
        result.getContent().stream().map(this::toSummary).toList(),
        result.getNumber(),
        result.getSize(),
        result.getTotalElements(),
        result.getTotalPages());
  }

  @GetMapping("/{termId}")
  public PolicyTermDetailResponse getPolicyTerm(@PathVariable UUID termId) {
    PolicyTerm term =
        policyTermService
            .findById(termId)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Policy term not found"));
    return toDetail(term);
  }

  private Sort parseSort(String sort) {
    if (sort == null || sort.isBlank()) {
      return Sort.by(Sort.Order.asc("effectiveToDate"));
    }
    String[] parts = sort.split(",");
    String field = parts[0].trim();
    String mapped = SORT_FIELDS.get(field);
    if (mapped == null) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Unsupported sort field: " + field);
    }
    Sort.Direction direction = Sort.Direction.ASC;
    if (parts.length > 1) {
      direction =
          Sort.Direction.fromOptionalString(parts[1].trim()).orElse(Sort.Direction.ASC);
    }
    return Sort.by(new Sort.Order(direction, mapped));
  }

  private PolicyTermSummaryResponse toSummary(PolicyTerm term) {
    Policy policy = term.getPolicy();
    return new PolicyTermSummaryResponse(
        term.getId(),
        policy.getPolicyNumber(),
        policy.getInsuredName(),
        term.getTermNumber(),
        term.getState(),
        term.getStatus(),
        term.getEffectiveFromDate(),
        term.getEffectiveToDate(),
        term.getBalanceDue(),
        term.getNextDueDate(),
        term.getLastPaymentDate());
  }

  private PolicyTermDetailResponse toDetail(PolicyTerm term) {
    Policy policy = term.getPolicy();
    return new PolicyTermDetailResponse(
        term.getId(),
        policy.getPolicyNumber(),
        policy.getInsuredName(),
        term.getTermNumber(),
        term.getState(),
        term.getStatus(),
        term.getEffectiveFromDate(),
        term.getEffectiveToDate(),
        term.getBalanceDue(),
        term.getNextDueDate(),
        term.getLastPaymentDate(),
        term.getCreatedAt(),
        term.getUpdatedAt());
  }
}
