package com.twotwo.matmatgotgot.domain.trip.controller;

import com.twotwo.matmatgotgot.domain.trip.dto.request.MenuInsertRequest;
import com.twotwo.matmatgotgot.domain.trip.dto.request.TripCreateRequestDTO;
import com.twotwo.matmatgotgot.domain.trip.dto.response.*;
import com.twotwo.matmatgotgot.domain.trip.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;

    @GetMapping("/main")
    public ResponseEntity<Map<String, List<TripCourseResponse>>> getTripMain(
            // 세션이나 JWT 토큰 등에서 회원 정보를 받아온다고 가정 (비로그인 시 null 허용)
            @RequestParam(value = "memberNo", required = false) Long memberNo) {

        Map<String, List<TripCourseResponse>> data = tripService.getTripMainData(memberNo);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/create/search")
    public ResponseEntity<?> searchRestaurants(@RequestParam("keyword") String keyword) {
        List<RestaurantDTO> list = tripService.searchRestaurants(keyword);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/create/tags")
    public ResponseEntity<?> selectTags() {
        List<TagDTO> list = tripService.selectTags();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/create/menus")
    public ResponseEntity<?> selectMenus(@RequestParam("restNo") Long restNo) {
        List<MenuDTO> list = tripService.selectMenus(restNo);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/create/menu")
    public ResponseEntity<?> insertMenu(
            @RequestParam Long restNo,
            @RequestParam String menuName,
            @RequestParam Integer menuPrice,
            @RequestPart(required = false)
            MultipartFile image
    ) throws Exception {
        tripService.insertMenu(
                restNo,
                menuName,
                menuPrice,
                image
        );
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createTripCourse(@RequestBody TripCreateRequestDTO requestDTO) {
        try {
            // 임시 사용자 ID (실무에서는 세션 또는 시큐리티 Context에서 추출)
            int memberNo = 1;

            tripService.createTripCourse(requestDTO, memberNo);
            return ResponseEntity.status(HttpStatus.CREATED).body("코스가 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("코스 등록 중 서버 에러가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/detail/{tplanNo}")
    public ResponseEntity<CourseDetailResponse> getCourseDetail(@PathVariable Long tplanNo) {
        System.out.println("hello");
        CourseDetailResponse detail = tripService.getCourseDetail(tplanNo);
        if (detail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detail);
    }
}
