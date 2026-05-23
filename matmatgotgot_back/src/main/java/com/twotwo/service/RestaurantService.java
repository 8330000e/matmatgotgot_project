package com.twotwo.service;

import com.twotwo.entity.Restaurant;
import com.twotwo.mapper.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantMapper restaurantMapper;

    public List<Restaurant> getLocalList() {
       List<Restaurant> list = RestaurantMapper.getLocalList();

        return
    }//
}
