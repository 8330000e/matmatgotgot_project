package com.twotwo.matmatgotgot.domain.trip.service;

import com.twotwo.matmatgotgot.domain.trip.dto.request.FavoriteRequest;
import com.twotwo.matmatgotgot.domain.trip.dto.request.MenuInsertRequest;
import com.twotwo.matmatgotgot.domain.trip.dto.request.TripCreateRequestDTO;
import com.twotwo.matmatgotgot.domain.trip.dto.request.TripUpdateDTO;
import com.twotwo.matmatgotgot.domain.trip.dto.response.*;
import com.twotwo.matmatgotgot.domain.trip.mapper.TripMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripMapper tripMapper;

    @Value("${file.root}")
    private String uploadPath;

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

    public List<TagDTO> selectTags() {
        List<Map<String, Object>> rawTags = tripMapper.selectTags();
        List<TagDTO> processedTags = new ArrayList<>();

        for (Map<String, Object> row : rawTags) {
            int tagNo = (int) row.get("tag_no");
            String tagName = (String) row.get("tag_name");

            processedTags.add(new TagDTO(tagNo, "#" + tagName, false));
        }

        return processedTags;
    }

    public List<MenuDTO> selectMenus(Long restNo) {
        return tripMapper.selectMenus(restNo);
    }

    @Transactional
    public void insertMenu(
            Long restNo,
            String menuName,
            Integer menuPrice,
            MultipartFile image
    ) throws Exception {

        String savedFileName = "basic.jpeg";

        if (image != null && !image.isEmpty()) {

            File dir = new File(uploadPath);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalName = image.getOriginalFilename();

            String extension =
                    originalName.substring(originalName.lastIndexOf("."));

            savedFileName =
                    UUID.randomUUID() + extension;

            File targetFile =
                    new File(uploadPath, savedFileName);

            image.transferTo(targetFile);
        }

        MenuInsertRequest request =
                new MenuInsertRequest(
                        restNo,
                        menuName,
                        menuPrice,
                        savedFileName
                );

        tripMapper.insertMenu(request);
    }

    @Transactional(rollbackFor = Exception.class)
    public void createTripCourse(TripCreateRequestDTO dto) {

        // 1. TRAVEL_PLAN_TBL 데이터 바인딩 및 인서트
        Map<String, Object> planMap = new HashMap<>();
        planMap.put("memberNo", dto.getMemberNo());
        planMap.put("tplanTitle", dto.getTplanTitle());
        planMap.put("tplanDesc", dto.getTplanDesc());
        planMap.put("tplanRegion", dto.getTplanRegion());
        planMap.put("tplanDays", dto.getTplanDays());
        planMap.put("tplanTotalPrice", dto.getTplanTotalPrice());

        tripMapper.insertTravelPlan(planMap);
        // MyBatis의 selectKey에 의해 planMap에 tplan_no가 주입됩니다.
        Long tplanNo = (Long) planMap.get("tplan_no");

        // 2. PLAN_TAG_TBL 인서트 (선택한 태그 리스트 순회)
        if (dto.getTagNos() != null && !dto.getTagNos().isEmpty()) {
            for (Integer tagNo : dto.getTagNos()) {
                tripMapper.insertPlanTag(tplanNo, tagNo);
            }
        }

        // 3. 일차별 코스 순회 및 일정 등록
        if (dto.getDays() != null) {
            for (TripCreateRequestDTO.DayData dayData : dto.getDays()) {

                // 3-1. 우선 해당 일차의 모든 일정(TRAVEL_SCHEDULE_TBL)과 추천 메뉴를 선제적으로 인서트
                for (TripCreateRequestDTO.ScheduleData scheData : dayData.getSchedules()) {
                    Map<String, Object> scheMap = new HashMap<>();
                    scheMap.put("tplanNo", tplanNo);
                    scheMap.put("tscheDayNo", scheData.getTscheDayNo());
                    scheMap.put("tscheOrderNo", scheData.getTscheOrderNo());
                    scheMap.put("restNo", scheData.getRestNo());

                    tripMapper.insertTravelSchedule(scheMap);
                    // 생성된 일정 고유번호를 확보하여 DTO 내부 저장 객체에 기록해 둡니다.
                    Long tscheNo = (Long) scheMap.get("tscheNo");
                    scheData.setGeneratedTscheNo(tscheNo);

                    // RECOMMEND_MENU_TBL 인서트 (식당별 선택 메뉴가 있다면 저장)
                    if (scheData.getSelectedMenuNos() != null && !scheData.getSelectedMenuNos().isEmpty()) {
                        for (Long menuNo : scheData.getSelectedMenuNos()) {
                            tripMapper.insertRecommendMenu(tscheNo, menuNo);
                        }
                    }
                }

                // 3-2. 같은 일차 내부에서 스케줄 간 이동 경로(TRAVEL_ROUTE_TBL) 매핑
                // index 번의 일정 정보에 Route가 기록되어 있다면 -> '현재 일정번호(from)'에서 'index+1 번의 일정번호(to)'로 이동함을 의미
                for (int i = 0; i < dayData.getSchedules().size() - 1; i++) {
                    TripCreateRequestDTO.ScheduleData currentSche = dayData.getSchedules().get(i);
                    TripCreateRequestDTO.ScheduleData nextSche = dayData.getSchedules().get(i + 1);

                    // 다음 목적지가 존재하고 프론트에서 이동 수단을 지정해 준 경우에만 저장
                    if (currentSche.getRoute() != null && currentSche.getRoute().getTransitType() != null) {
                        Long fromTscheNo = currentSche.getGeneratedTscheNo();
                        Long toTscheNo = nextSche.getGeneratedTscheNo();
                        String transitType = currentSche.getRoute().getTransitType();

                        System.out.println(fromTscheNo);
                        System.out.println(toTscheNo);
                        System.out.println(transitType);
                        tripMapper.createTripCourse(fromTscheNo, toTscheNo, transitType);
                    }
                }
            }
        }
    }

    public Map<String, List<TripCourseResponse>> getTripMainData(Long memberNo) {

        Map<String, List<TripCourseResponse>> resultMap = new HashMap<>();

        List<TripCourseResponse> allPlans =
                tripMapper.selectAllPlans();

        // 내가 만든 코스
        List<TripCourseResponse> myPlans =
                allPlans.stream()
                        .filter(plan ->
                                memberNo != null &&
                                        memberNo.equals(plan.getMemberNo()))
                        .toList();

        // TOP10
        List<TripCourseResponse> top10Plans =
                allPlans.stream()
                        .sorted(
                                Comparator.comparing(
                                        TripCourseResponse::getTplanView
                                ).reversed()
                        )
                        .limit(10)
                        .toList();

        resultMap.put("allPlans", allPlans);
        resultMap.put("myPlans", myPlans);
        resultMap.put("top10Plans", top10Plans);

        if(memberNo != null) {
            resultMap.put(
                    "favoritePlans",
                    tripMapper.selectFavoritePlans(memberNo)
            );
        } else {
            resultMap.put(
                    "favoritePlans",
                    new ArrayList<>()
            );
        }

        return resultMap;
    }

    @Transactional
    public CourseDetailResponse getCourseDetail(Long tplanNo) {
        tripMapper.updateViewCount(tplanNo);

        CourseDetailResponse response = tripMapper.selectTravelPlan(tplanNo);
        if (response == null) return null;

        response.setTags(tripMapper.selectPlanTags(tplanNo));

        List<RawSchedule> rawSchedules = tripMapper.selectRawSchedulesWithDay(tplanNo);

        Map<Integer, List<RouteNodeDTO>> dayRoutes = rawSchedules.stream()
                .collect(Collectors.groupingBy(
                        RawSchedule::getTscheDayNo,
                        LinkedHashMap::new,
                        Collectors.mapping(raw -> {
                            RouteNodeDTO node = new RouteNodeDTO();
                            node.setTscheNo(raw.getTscheNo());
                            node.setTscheOrderNo(raw.getTscheOrderNo());
                            node.setRestNo(raw.getRestNo());
                            node.setRestName(raw.getRestName());
                            node.setLat(raw.getLat());
                            node.setLng(raw.getLng());

                            node.setSelectedMenus(tripMapper.selectRecommendMenus(raw.getTscheNo()));
                            return node;
                        }, Collectors.toList())
                ));

        dayRoutes.forEach((day, nodes) -> {
            for (int i = 0; i < nodes.size() - 1; i++) {
                Long fromNo = nodes.get(i).getTscheNo();
                Long toNo = nodes.get(i + 1).getTscheNo();
                String transit = tripMapper.selectTransitType(fromNo, toNo);

                nodes.get(i).setTransitType(transit != null ? transit : "WALK");
            }
        });

        response.setDayRoutes(dayRoutes);
        return response;
    }

    @Transactional
    public boolean toggleFavorite(FavoriteRequest req) {
        int count = tripMapper.checkFavorite(req);
        if (count > 0) {
            tripMapper.deleteFavorite(req);
            // 추가로 TRAVEL_PLAN_TBL의 tplan_like 카운트를 -1 하는 로직을 넣으면 더 좋습니다.
            return false; // 찜 해제됨
        } else {
            tripMapper.insertFavorite(req);
            return true; // 찜 등록됨
        }
    }

    public boolean isFavoritePlan(FavoriteRequest req) {
        int count = tripMapper.checkFavorite(req);
        return count > 0;
    }

    @Transactional
    public int updateFavoriteCount(Long tplanNo, String action) {
        if ("INCREMENT".equalsIgnoreCase(action)) {
            tripMapper.incrementFavoriteCount(tplanNo);
        } else if ("DECREMENT".equalsIgnoreCase(action)) {
            tripMapper.decrementFavoriteCount(tplanNo);
        }

        return tripMapper.selectFavoriteCount(tplanNo);
    }

    @Transactional
    public void updateCourse(TripUpdateDTO updateDto) {
        Long tplanNo = updateDto.getTplanNo();

        // 1. 메인 마스터 정보 테이블 UPDATE
        tripMapper.updateTravelPlan(updateDto);

        // 2. 종속 테이블 데이터 기존 내역 초기화 (외래키 ON DELETE CASCADE로 인해 tplan_no 기준 하위 자동삭제 연동 가능)
        tripMapper.deletePlanTags(tplanNo);
        tripMapper.deleteTravelSchedules(tplanNo);

        // 3. 태그(PLAN_TAG_TBL) 재등록
        if (updateDto.getTagNos() != null && !updateDto.getTagNos().isEmpty()) {
            for (Integer tagNo : updateDto.getTagNos()) {
                tripMapper.insertPlanTag(tplanNo, tagNo);
            }
        }

        // 4. 스케줄 및 경로 재등록
        if (updateDto.getDays() != null) {
            for (TripUpdateDTO.DayDataDto dayDto : updateDto.getDays()) {
                if (dayDto.getSchedules() == null) continue;

                Long prevTscheNo = null; // 💡 이전 등록된 일정번호를 저장하여 경로 테이블에 바인딩
                String pendingTransitType = null; // 출발지 스케줄 기준의 이동수단 임시 보관

                for (TripUpdateDTO.ScheduleDto scheDto : dayDto.getSchedules()) {

                    // 4-1. TRAVEL_SCHEDULE_TBL 등록
                    Map<String, Object> scheParam = new HashMap<>();
                    scheParam.put("tplanNo", tplanNo);
                    scheParam.put("tscheDayNo", scheDto.getTscheDayNo());
                    scheParam.put("tscheOrderNo", scheDto.getTscheOrderNo());
                    scheParam.put("restNo", scheDto.getRestNo());

                    tripMapper.insertTravelSchedule(scheParam);
                    Long currentTscheNo = (Long) scheParam.get("tscheNo"); // 자동 생성된 PK

                    // 4-2. RECOMMEND_MENU_TBL (추천 메뉴 매핑) 등록
                    if (scheDto.getSelectedMenuNos() != null && !scheDto.getSelectedMenuNos().isEmpty()) {
                        for (Long menuNo : scheDto.getSelectedMenuNos()) {
                            tripMapper.insertRecommendMenu(currentTscheNo, menuNo);
                        }
                    }

                    // 4-3. TRAVEL_ROUTE_TBL (이동 경로) 등록
                    // 이전 스케줄이 존재한다면, '이전 목적지 -> 현재 목적지'로 가는 경로를 완성하여 삽입
                    if (prevTscheNo != null && pendingTransitType != null) {
                        tripMapper.createTripCourse(prevTscheNo, currentTscheNo, pendingTransitType);
                    }

                    // 다음 루프를 위해 현재 스케줄 번호와 이동 경로 수단을 백업
                    prevTscheNo = currentTscheNo;
                    pendingTransitType = (scheDto.getRoute() != null) ? scheDto.getRoute().getTransitType() : null;
                }
            }
        }
    }

    public List<MyUnfinishedCourseDTO> getMyUnfinishedCourses(Long memberNo) {
        return tripMapper.selectUnfinishedCoursesByMemberNo(memberNo);
    }
}
