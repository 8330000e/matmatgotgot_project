package com.twotwo.matmatgotgot.domain.member.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonProperty;

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
}