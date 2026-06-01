package com.twotwo.matmatgotgot.domain.trip.mapper;

import com.twotwo.matmatgotgot.domain.trip.dto.response.RestaurantDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TripMapper {
    List<RestaurantDTO> findByChosung(String keyword);
    List<RestaurantDTO> findByKeyword(String keyword);
}
