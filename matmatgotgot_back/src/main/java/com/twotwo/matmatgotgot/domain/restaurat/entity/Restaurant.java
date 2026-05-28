package com.twotwo.matmatgotgot.domain.restaurat.entity;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value="restaurant")
public class Restaurant {
    private Integer rest_no;
    private String member_no;
    private String rest_name;
    private String address;
    private Double lat;
    private Double lng;
    private String category;
    private String phone;
    private String hours;
    private Integer avg_rating;
    private Integer review_total_count;
    private Integer local_review_count;
    private String content;
    private String ai_review;
    private Integer rest_status;
    private Date created_at;
}
