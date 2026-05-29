package com.twotwo.matmatgotgot.domain.restaurant.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.apache.ibatis.type.Alias;

@Builder
@AllArgsConstructor
@Data
@Alias("restViewResponse")
public class RestViewResponse {

    private String restName;
    private String restAddr;
    private String category;
    private String aiContent;
    private String restContent;
    private Double lat;
    private Double lng;
    private String phone;
    private String hours;
    private String[] tags;
    private String[] menus;
    private Boolean isLike;
    private Boolean isReport;
    private Double avgRating;
}
