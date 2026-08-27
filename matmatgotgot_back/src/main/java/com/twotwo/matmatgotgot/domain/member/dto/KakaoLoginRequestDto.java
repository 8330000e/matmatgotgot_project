package com.twotwo.matmatgotgot.domain.member.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class KakaoLoginRequestDto {

    @JsonProperty("memberEmail")
    private String memberEmail;

    @JsonProperty("memberNickname")
    private String memberNickname;

    @JsonProperty("memberThumb")
    private String memberThumb;
}