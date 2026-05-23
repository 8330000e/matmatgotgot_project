package com.twotwo.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestaurantResponse {

    private Long restNo;
    private String writerNickname;
    private String restName;
    private String address;
    private Double lat;
    private Double lng;
    private String category;
    private String phone;
    private String hours;
    private Integer avgRating;
    private Integer reviewTotalCount;
    private Integer localReviewCount;
    private String content;
    private String aiReview;
}
