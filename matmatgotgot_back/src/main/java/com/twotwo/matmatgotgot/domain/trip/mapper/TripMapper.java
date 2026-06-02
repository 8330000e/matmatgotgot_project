package com.twotwo.matmatgotgot.domain.trip.mapper;

import com.twotwo.matmatgotgot.domain.trip.dto.request.MenuInsertRequest;
import com.twotwo.matmatgotgot.domain.trip.dto.response.MenuDTO;
import com.twotwo.matmatgotgot.domain.trip.dto.response.RestaurantDTO;
import com.twotwo.matmatgotgot.domain.trip.dto.response.TripCourseResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface TripMapper {
    List<RestaurantDTO> findByChosung(String keyword);
    List<RestaurantDTO> findByKeyword(String keyword);
    List<Map<String, Object>> selectTags();
    List<MenuDTO> selectMenus(@Param("restNo") Long restNo);
    int insertMenu(MenuInsertRequest request);
    void insertTravelPlan(Map<String, Object> planMap);

    void insertPlanTag(@Param("tplanNo") Long tplanNo, @Param("tagNo") Integer tagNo);

    void insertTravelSchedule(Map<String, Object> scheMap);

    void insertRecommendMenu(@Param("tscheNo") Long tscheNo, @Param("menuNo") Long menuNo);

    void createTripCourse(@Param("fromTscheNo") Long fromTscheNo,
                           @Param("toTscheNo") Long toTscheNo,
                           @Param("transitType") String transitType);

    List<TripCourseResponse> selectAllPlans();
    List<TripCourseResponse> selectFavoritePlans(@Param("memberNo") Long memberNo);
}
