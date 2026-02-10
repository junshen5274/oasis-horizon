package com.oasishorizon.api.policy.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PolicyTermDetailResponse(
    UUID id,
    String policyNumber,
    String insuredName,
    int termNumber,
    String state,
    String status,
    LocalDate effectiveFromDate,
    LocalDate effectiveToDate,
    BigDecimal balanceDue,
    LocalDate nextDueDate,
    LocalDate lastPaymentDate,
    Instant createdAt,
    Instant updatedAt) {}
