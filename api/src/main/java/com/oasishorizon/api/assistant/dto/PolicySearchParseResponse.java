package com.oasishorizon.api.assistant.dto;

public record PolicySearchParseResponse(
    String q, String state, String status, String date_field, String date_from, String date_to) {}
