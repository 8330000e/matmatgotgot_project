package com.twotwo.matmatgotgot.domain.restaurant.controller;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.*;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestReviewsResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.ReviewCommentResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.ReviewViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import com.twotwo.matmatgotgot.domain.restaurant.service.RestaurantService;
import com.twotwo.matmatgotgot.global.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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

    // 맛집 등록
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

    // tip tap 이미지 등록
    @PostMapping(value = "/image-upload")
    public ResponseEntity<?> imageUpload(@RequestParam MultipartFile image) {
        String savepath = root + "restaurant/";
        File dir = new File(savepath);  // 디렉토리 없으면 생성
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filepath = fileUtil.upload(savepath, image);

        return ResponseEntity.ok(filepath);
    }//

    //
    @GetMapping
    public ResponseEntity<?> restaurantViewInfo(@RequestParam Long memberNo, @RequestParam Long restNo) {
        RestViewResponse restRes = restaurantService.restaurantViewInfo(memberNo, restNo);

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
        try {
            boolean result = restaurantService.reviewCreate(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }//

    @GetMapping("/review/{reviewNo}")
    public ResponseEntity<?> getReviewView(@PathVariable Long reviewNo) {
        ReviewViewResponse res = restaurantService.getReviewView(reviewNo);

        return ResponseEntity.ok(res);
    }//

    // 댓글/대댓글 목록 조회
    @GetMapping("/review/{reviewNo}/comments")
    public ResponseEntity<?> commentList(@PathVariable Long reviewNo) {
        List<ReviewCommentResponse> list = restaurantService.commentList(reviewNo);
        return ResponseEntity.ok(list);
    }//

    // 댓글/대댓글 등록
    @PostMapping("/review/{reviewNo}/comments")
    public ResponseEntity<?> commentRegist(@PathVariable Long reviewNo,
                                           @RequestBody ReviewCommentRequest request) {
        ReviewCommentResponse saved = restaurantService.commentRegist(reviewNo, request);
        return ResponseEntity.ok(saved);
    }//

    // 댓글/대댓글 수정
    @PatchMapping("/review/comment/{commentNo}")
    public ResponseEntity<?> commentUpdate(@PathVariable Long commentNo,
                                           @RequestBody ReviewCommentUpdateRequest request) {
        restaurantService.commentUpdate(commentNo, request.getContent());
        return ResponseEntity.ok().build();
    }//

    // 댓글/대댓글 삭제
    @DeleteMapping("/review/comment/{commentNo}")
    public ResponseEntity<?> commentDelete(@PathVariable Long commentNo) {
        restaurantService.commentDelete(commentNo);
        return ResponseEntity.ok().build();
    }//

    // 맛집 메인화면 추천 리스트
    @GetMapping("/recommand")
    public ResponseEntity<?> getRecommandLists() {

    }//



}
