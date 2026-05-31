package com.twotwo.matmatgotgot.domain.restaurant.service;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.RestViewReviewsRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.request.ReviewCreateRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestReviewsResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import com.twotwo.matmatgotgot.domain.restaurant.mapper.RestaurantMapper;
import com.twotwo.matmatgotgot.global.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantMapper restaurantMapper;
    private final FileUtil fileUtil;

    @Value("${file.root}")
    private String root;

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
            throw new RuntimeException("리뷰 저장 실패");
        }

        if (request.getReviewMenu() != null && !request.getReviewMenu().isBlank()) {
            List<String> menuList = Arrays.stream(request.getReviewMenu().trim().split("\\s+"))
                    .distinct()
                    .collect(Collectors.toList());

            int res2 = restaurantMapper.insertReviewMenus(request.getReviewNo(), menuList);
            if (res2 != menuList.size()) {
                throw new RuntimeException("메뉴 저장 실패");
            }
        }

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            int res3 = restaurantMapper.insertReviewTags(request.getReviewNo(), request.getTags());
            if (res3 != request.getTags().size()) {
                throw new RuntimeException("태그 저장 실패");
            }
        }

        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            String savepath = root + "restaurant/";
            new File(savepath).mkdirs(); // 디렉토리 없으면 생성

            List<String> imageUrls = new ArrayList<>();

            for (MultipartFile file : request.getFiles()) {
                if (file.isEmpty()) continue;

                String savedFileName = fileUtil.upload(savepath, file); // UUID 파일명 반환
                imageUrls.add(savedFileName);
            }

            if (!imageUrls.isEmpty()) {
                int res4 = restaurantMapper.insertReviewImages(request.getReviewNo(), imageUrls);
                if (res4 != imageUrls.size()) {
                    throw new RuntimeException("이미지 저장 실패");
                }
            }
        }

        return true;
    }//
}
