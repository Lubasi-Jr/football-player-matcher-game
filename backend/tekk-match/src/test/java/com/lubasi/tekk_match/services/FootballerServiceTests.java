package com.lubasi.tekk_match.services;

import com.lubasi.tekk_match.footballer.models.Footballer;
import com.lubasi.tekk_match.footballer.repository.FootballerRepository;
import com.lubasi.tekk_match.footballer.services.FootballerService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FootballerServiceTests {
    @Mock
    private FootballerRepository footballerRepository;

    @InjectMocks
    private FootballerService footballerService;

    @Test
    public void FootballService_GetFootballersFromSearchQuery_ReturnsListOfFootballers(){
        // Mock a search query
        String searchQuery = "Pet";
        // Mock a pageable object
        Pageable pageable = PageRequest.of(0,10);
        // Mock footballer list
        Footballer player1 = new Footballer();
        player1.setFootballerName("Petr Cech");

        Footballer player2 = new Footballer();
        player2.setFootballerName("Peter Schmeichel");

        List<Footballer> ballers = Arrays.asList(player2,player1);

        when(footballerRepository.findByFootballerNameContainingIgnoreCase(searchQuery,pageable)).thenReturn(ballers);

        List<Footballer> result = footballerService.getPlayersFromSearchQuery(searchQuery,pageable);

        assertNotNull(result);
        assertEquals(2, result.size());

        verify(footballerRepository, times(1)).findByFootballerNameContainingIgnoreCase(searchQuery, pageable);
        // Verify that the fallback method was NEVER called
        verify(footballerRepository, never()).findAll(any(Pageable.class));
    }
}
