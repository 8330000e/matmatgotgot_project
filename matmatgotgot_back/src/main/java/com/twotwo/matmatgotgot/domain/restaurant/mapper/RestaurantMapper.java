package com.twotwo.matmatgotgot.domain.restaurant.mapper;

import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface RestaurantMapper {

    int restaurantCreate(Restaurant restaurant);

    RestViewResponse restaurantViewInfo(HashMap<String, Long> paramMap);

    List<String> getTags(HashMap<String, Long> paramMap);

    List<String> getMenus(HashMap<String, Long> paramMap);
}
