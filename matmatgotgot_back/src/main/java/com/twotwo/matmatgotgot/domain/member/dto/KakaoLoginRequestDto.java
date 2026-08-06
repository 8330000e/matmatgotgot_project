package com.twotwo.matmatgotgot.domain.member.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class KakaoLoginRequestDto {
    private String memberEmail;
    private String memberNickname;
    private String memberThumb;
}