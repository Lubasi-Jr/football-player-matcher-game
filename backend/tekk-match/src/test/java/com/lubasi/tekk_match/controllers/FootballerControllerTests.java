package com.lubasi.tekk_match.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.lubasi.tekk_match.footballer.controllers.FootballerController;
import com.lubasi.tekk_match.footballer.models.Footballer;
import com.lubasi.tekk_match.footballer.services.FootballerService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@WebMvcTest(controllers = FootballerController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class FootballerControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FootballerService footballerService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void FootballerController_GetPlayersFromQuery_Returns_PaginatedListOfPlayers() throws Exception{
        // ARRANGE
        // Create mock list of footballers
        Footballer footballer1 = Footballer.builder().footballerId(UUID.fromString("adabai-128198-ndfjsajio"))
                .footballerName("Van Persie")
                .dob("12/07/2002")
                .flag("RANDOM-FLAG-URL")
                .position("Striker")
                .nationality("Dutch")
                .build();
        Footballer footballer2 = Footballer.builder()
                .footballerId(UUID.randomUUID()) // Using randomUUID for convenience
                .footballerName("Thierry Henry")
                .dob("17/08/1977")
                .flag("FRANCE-FLAG-URL")
                .position("Striker")
                .nationality("French")
                .build();

        Footballer footballer3 = Footballer.builder()
                .footballerId(UUID.randomUUID())
                .footballerName("Wayne Rooney")
                .dob("24/10/1985")
                .flag("ENGLAND-FLAG-URL")
                .position("Forward")
                .nationality("English")
                .build();

        Footballer footballer4 = Footballer.builder()
                .footballerId(UUID.randomUUID())
                .footballerName("Luka Modric")
                .dob("09/09/1985")
                .flag("CROATIA-FLAG-URL")
                .position("Midfielder")
                .nationality("Croatian")
                .build();
        List<Footballer> mockListOfFootballers = new ArrayList<>(Arrays.asList(footballer4,footballer1,footballer3,footballer2));

        // Mock the params
        int pageNumber = 1;
        int pageSize = 10;
        PageRequest pageable = PageRequest.of(1,10);
        String query = "Van";

        // Mock the function call
        Mockito.when(footballerService.getPlayersFromSearchQuery(query,pageable)).thenReturn(mockListOfFootballers);

        // ACT
        ResultActions result = mockMvc.perform(get("/api/players/search")
                .param("searchQuery",query)
                .param("page", String.valueOf(pageNumber))
                .param("size",String.valueOf(pageSize)));

        // ASSERT
        result.andExpect(status().isOk());
        result.andExpect(jsonPath("$[0].footballerName").value("Luka Modric"));
        result.andExpect(jsonPath("$[0].position").value("Midfielder"));
        result.andExpect(jsonPath("$[0].nationality").value("Croatian"));



    }
}
