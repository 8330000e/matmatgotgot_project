package com.twotwo.matmatgotgot.domain.restaurant.controller;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.RestCreateRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.request.RestViewReviewsRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.request.ReviewCreateRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestReviewsResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import com.twotwo.matmatgotgot.domain.restaurant.service.RestaurantService;
import com.twotwo.matmatgotgot.global.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/restaurants")
public class RestaurantController {

    @Value("${file.root}")
    private String root;

    private final RestaurantService restaurantService;
    private final FileUtil fileUtil;

    @PostMapping
    public ResponseEntity<?> restaurantCreate(@RequestBody RestCreateRequest request) {
        Restaurant restaurant = Restaurant.builder()
                .restName(request.getRestName())
                .restAddr(request.getRestAddr())
                .hours(request.getRestHours())
                .phone(request.getRestPhone())
                .category(request.getCategory())
                .restContent(request.getContent())
                .lat(request.getLat())
                .lng(request.getLng())
                .memberNo(1L) // request 에 memberNo 있다고 가정
                .build();

        Document doc = Jsoup.parse(request.getContent());
        // 이미지 태그 선택자로 첫 번째 요소를 가져옴
        // 단, 이미지 태그가 한 개도 없으면 null 리턴
        Element firstImg = doc.selectFirst("img");
        String restThumb = firstImg == null ? null : firstImg.attr("src");
        restaurant.setRestThumb(restThumb);

        int result = restaurantService.restaurantCreate(restaurant);

        return ResponseEntity.ok(result);
    }//

    @PostMapping(value = "/image-upload")
    public ResponseEntity<?> imageUpload(@RequestParam MultipartFile image) {
        String savepath = root + "restaurant/";
        String filepath = fileUtil.upload(savepath, image);

        return ResponseEntity.ok(filepath);
    }//

    @GetMapping
    public ResponseEntity<?> restaurantViewInfo(@RequestParam Long memberNo, @RequestParam Long restNo) {
        HashMap<String, Long> paramMap = new HashMap<>();
        paramMap.put("memberNo", memberNo);
        paramMap.put("restNo", restNo);

        RestViewResponse restRes = restaurantService.restaurantViewInfo(paramMap);

        return ResponseEntity.ok(restRes);
    }//

    @GetMapping("/reviews")
    public ResponseEntity<?> restaurantViewReviews(@ModelAttribute RestViewReviewsRequest request) {
        List<RestReviewsResponse> reviewResList = restaurantService.restaurantViewReviews(request);

        int count = restaurantService.restaurantViewReviewsCnt(request);
        int totalPage = (int) Math.ceil(count / (double) request.getSize());

        Map<String, Object> res = new HashMap<>();
        res.put("list", reviewResList);
        res.put("reviewsCnt", count);
        res.put("totalPage", totalPage);

        return ResponseEntity.ok(res);
    }//

    @PostMapping("/review")
    public ResponseEntity<?> reviewCreate(@ModelAttribute ReviewCreateRequest request) {
        boolean success = restaurantService.reviewCreate(request);

        return null;
    }//
}
