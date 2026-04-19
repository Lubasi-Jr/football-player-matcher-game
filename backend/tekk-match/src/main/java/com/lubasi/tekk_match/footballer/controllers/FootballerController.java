package com.lubasi.tekk_match.footballer.controllers;

import com.lubasi.tekk_match.footballer.models.Footballer;
import com.lubasi.tekk_match.footballer.services.FootballerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import com.lubasi.tekk_match.footballer.models.PageResponse;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class FootballerController {
    private final FootballerService footballerService;

    @Autowired
    public FootballerController(FootballerService footballerService){
        this.footballerService = footballerService;
    }

    @GetMapping("/search")
    public PageResponse<Footballer> getPlayersFromQuery(@RequestParam(defaultValue = "") String searchQuery,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size){

        Page<Footballer> result =  footballerService.getPlayersFromSearchQuery(searchQuery, PageRequest.of(page,size));
        return new PageResponse<>(result);
    }

}
