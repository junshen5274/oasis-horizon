package com.oasishorizon.api.policy.dto;

import java.util.List;

public record PolicyTermPageResponse(
    List<PolicyTermSummaryResponse> items,
    int page,
    int size,
    long totalElements,
    int totalPages) {}
