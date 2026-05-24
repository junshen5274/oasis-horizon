package com.oasishorizon.api.assistant.dto;

import jakarta.validation.constraints.NotBlank;

public record PolicySearchParseRequest(@NotBlank(message = "prompt is required") String prompt) {}
