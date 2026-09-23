package com.twotwo.matmatgotgot.domain.member.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import com.twotwo.matmatgotgot.domain.restaurant.entity.RestStatus;

import lombok.Data;
import lombok.ToString;

@Data 
@ToString
@Alias(value = "getreview")
public class GetReview {
    private String memberId;
    private Long restNo;
    private String restName;
    private String restAddr;
    private String category;
    private String aiReview;
    private String restContent;
    private Double lat;
    private Double lng;
    private String phone;
    private String hours;
    private Integer ratingSum;
    private Integer reviewTotalCount;
    private Double ratingAvg;
    private Boolean isLike;
    private Boolean isReport;
    private List<String> tags;
    private List<String> menus;
    private Integer localReviewCount;
    private RestStatus restStatus;  // NORMAL, HIDDEN
    private String restThumb;
    private String createdAt;
}
