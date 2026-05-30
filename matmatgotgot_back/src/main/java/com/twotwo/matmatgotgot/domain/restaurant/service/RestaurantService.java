package com.twotwo.matmatgotgot.domain.restaurant.service;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.RestViewReviewsRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestReviewsResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import com.twotwo.matmatgotgot.domain.restaurant.mapper.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

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


    public RestViewResponse restaurantViewInfo(HashMap<String, Long> paramMap) {
        RestViewResponse restRes = restaurantMapper.restaurantViewInfo(paramMap);
        List<String> tags = restaurantMapper.getTags(paramMap);
        List<String> menus = restaurantMapper.getMenus(paramMap);

        restRes.setTags(tags);
        restRes.setMenus(menus);

        return restRes;
    }//

    public List<RestReviewsResponse> restaurantViewReviews(RestViewReviewsRequest request) {
        List<RestReviewsResponse> reviewResList = restaurantMapper.restaurantViewReviews(request);

        for (RestReviewsResponse restReviewsResponse : reviewResList) {
            List<String> menus = restaurantMapper.getMenusByReviewNo(restReviewsResponse.getReviewNo());
            restReviewsResponse.setMenus(menus);
        }

        return reviewResList;
    }//

    public int restaurantViewReviewsCnt(RestViewReviewsRequest request) {
        return restaurantMapper.restaurantViewReviewsCnt(request);
    }//
}
