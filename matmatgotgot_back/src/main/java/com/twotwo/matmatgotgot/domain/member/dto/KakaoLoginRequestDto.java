package com.twotwo.matmatgotgot.domain.member.dto;

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
    private String memberEmail;
    private String memberNickname;
    private String memberThumb;
}