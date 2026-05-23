package com.twotwo.mapper;

import com.twotwo.entity.Restaurant;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RestaurantMapper {

    List<Restaurant> getLocalList();
}
