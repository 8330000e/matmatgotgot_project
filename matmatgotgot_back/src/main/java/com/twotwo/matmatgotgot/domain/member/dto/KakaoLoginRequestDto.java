package com.twotwo.matmatgotgot.domain.member.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class KakaoLoginRequestDto {

    @JsonProperty("memberEmail")
    private String memberEmail;

    @JsonProperty("memberNickname")
    private String memberNickname;

    @JsonProperty("memberThumb")
    private String memberThumb;

    // 스프링이 JSON을 바인딩할 때 꼭 필요한 기본 생성자
    public KakaoLoginRequestDto() {}
}