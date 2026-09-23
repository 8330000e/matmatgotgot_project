package com.twotwo.matmatgotgot.domain.member.dto;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Alias(value = "reviewSdto")
public class MemberReviewSummaryDTO {
    private int reviewCnt;     // SQL의 review_cnt 매핑
    private String guGunSi;    // SQL의 gu_gun_si 매핑
}