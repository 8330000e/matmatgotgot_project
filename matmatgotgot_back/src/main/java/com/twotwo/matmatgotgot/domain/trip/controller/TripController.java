package com.twotwo.matmatgotgot.domain.trip.controller;

import com.twotwo.matmatgotgot.domain.trip.dto.response.RestaurantDTO;
import com.twotwo.matmatgotgot.domain.trip.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trips")
public class TripController {
    private final TripService tripService;

    @GetMapping("/create/search")
    public ResponseEntity<?> searchRestaurants(@RequestParam("keyword") String keyword) {
        System.out.println("keyword = " + keyword);
        List<RestaurantDTO> list = tripService.searchRestaurants(keyword);
        System.out.println(list);
        return ResponseEntity.ok(list);
    }
}
