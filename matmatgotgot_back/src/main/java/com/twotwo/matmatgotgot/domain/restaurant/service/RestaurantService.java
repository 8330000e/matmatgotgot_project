package com.twotwo.matmatgotgot.domain.restaurant.service;

import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import com.twotwo.matmatgotgot.domain.restaurant.mapper.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantMapper restaurantMapper;

    @Transactional
    public int restaurantCreate(Restaurant restaurant) {
        int result = restaurantMapper.restaurantCreate(restaurant);

        log.info("restaurant: {}", restaurant);

        return result;
    }//


    public RestViewResponse restaurantView(HashMap<String, Long> paramMap) {
        RestViewResponse restRes = restaurantMapper.restaurantView(paramMap);

//        String[] tags = restaurantMapper.getTags();
//        String[] menus = restaurantMapper.getMenus();

        return null;
    }//
}//
