package com.twotwo.matmatgotgot.domain.trip.service;

import com.twotwo.matmatgotgot.domain.trip.dto.response.RestaurantDTO;
import com.twotwo.matmatgotgot.domain.trip.mapper.TripMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripMapper tripMapper;

    public List<RestaurantDTO> searchRestaurants(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return Collections.emptyList();
        }

        if (keyword.matches("^[ㄱ-ㅎ]+$")) {
            return tripMapper.findByChosung(keyword);
        } else {
            return tripMapper.findByKeyword(keyword);
        }
    }
}
