package com.oasishorizon.api.assistant;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.oasishorizon.api.assistant.dto.PolicySearchParseResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestExecutionListeners.MergeMode;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.web.ServletTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AssistantController.class)
@Import(AssistantControllerTest.TestPolicySearchParseServiceConfig.class)
@TestExecutionListeners(
    listeners = {
      ServletTestExecutionListener.class,
      DependencyInjectionTestExecutionListener.class,
      DirtiesContextTestExecutionListener.class
    },
    mergeMode = MergeMode.REPLACE_DEFAULTS)
class AssistantControllerTest {
  @Autowired private MockMvc mockMvc;

  @Test
  void rejectsBlankPrompt() throws Exception {
    mockMvc
        .perform(
            post("/api/assistant/policy-search-parse")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"prompt\":\"   \"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void returnsParsedFilters() throws Exception {
    mockMvc
        .perform(
            post("/api/assistant/policy-search-parse")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"prompt\":\"show all NY active policies\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.q").value(""))
        .andExpect(jsonPath("$.state").value("NY"))
        .andExpect(jsonPath("$.status").value("ACTIVE"))
        .andExpect(jsonPath("$.date_field").value("expiration"))
        .andExpect(jsonPath("$.date_from").value(""))
        .andExpect(jsonPath("$.date_to").value(""));
  }

  @TestConfiguration
  static class TestPolicySearchParseServiceConfig {
    @Bean
    PolicySearchParseService policySearchParseService() {
      return new PolicySearchParseService() {
        @Override
        public PolicySearchParseResponse parse(String prompt) {
          if ("show all NY active policies".equals(prompt)) {
            return new PolicySearchParseResponse("", "NY", "ACTIVE", "expiration", "", "");
          }

          return new PolicySearchParseResponse("", "", "", "expiration", "", "");
        }
      };
    }
  }
}
