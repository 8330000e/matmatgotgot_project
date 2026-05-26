package com.twotwo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Alias(value="restaurant")
public class Restaurant {

    private Long restNo;
    private Long memberNo;
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

    private String writerNickname;
}


