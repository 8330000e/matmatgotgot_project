package com.twotwo.matmatgotgot.domain.trip.dto.request;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@Alias(value = "tripUpdateDTO")
public class TripUpdateDTO {
    private Long tplanNo;            // tplan_no
    private String tplanTitle;       // tplan_title
    private String tplanDesc;        // tplan_desc
    private String tplanRegion;      // tplan_region
    private int tplanDays;           // tplan_days
    private int tplanTotalPrice;     // tplan_total_price
    private List<Integer> tagNos;    // tag_no 리스트
    private List<DayDataDto> days;   // 일차별 스케줄 구조

    @Data
    public static class DayDataDto {
        private int day;
        private List<ScheduleDto> schedules;
    }

    @Data
    public static class ScheduleDto {
        private int tscheDayNo;      // tsche_day_no
        private int tscheOrderNo;    // tsche_order_no
        private Long restNo;         // rest_no
        private List<Long> selectedMenuNos; // menu_no 리스트
        private RouteDto route;      // 이동 정보 (마지막 순서는 null)
    }

    @Data
    public static class RouteDto {
        private String transitType;  // transit_type (WALK, PUB, CAR)
    }
}