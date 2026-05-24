package com.oasishorizon.api.assistant;

import com.oasishorizon.api.assistant.dto.PolicySearchParseRequest;
import com.oasishorizon.api.assistant.dto.PolicySearchParseResponse;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
@Validated
public class AssistantController {
  private final PolicySearchParseService policySearchParseService;

  public AssistantController(PolicySearchParseService policySearchParseService) {
    this.policySearchParseService = policySearchParseService;
  }

  @PostMapping("/policy-search-parse")
  public PolicySearchParseResponse parsePolicySearch(
      @Valid @RequestBody PolicySearchParseRequest request) {
    return policySearchParseService.parse(request.prompt());
  }
}
