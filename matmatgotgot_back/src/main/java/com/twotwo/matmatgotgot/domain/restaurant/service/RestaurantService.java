package com.twotwo.matmatgotgot.domain.restaurant.service;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.RestViewReviewsRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.request.ReviewCreateRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestReviewsResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import com.twotwo.matmatgotgot.domain.restaurant.mapper.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
    public boolean reviewCreate(ReviewCreateRequest request) {
        int res1 = restaurantMapper.reviewInsert(request);
        if (res1 != 1) {
            return false;
        }

        if (request.getReviewMenu() != null && !request.getReviewMenu().isBlank()) {
            List<String> menuList = Arrays.stream(request.getReviewMenu().trim().split("\\s+"))
                    .distinct()
                    .collect(Collectors.toList());

            int res2 = restaurantMapper.insertReviewMenus(request.getReviewNo(), menuList);
            if (res2 != 1) {
                return false;
            }
        }


        return true;
    }//
}
