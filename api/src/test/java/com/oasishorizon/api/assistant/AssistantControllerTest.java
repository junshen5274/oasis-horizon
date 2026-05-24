package com.oasishorizon.api.assistant;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
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
}
