package com.twotwo.controller;

import com.twotwo.entity.Restaurant;
import com.twotwo.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/local")
    public ResponseEntity<?> getLocalList() {
        List<Restaurant> list = restaurantService.getLocalList();






        return null;
    }//
}
