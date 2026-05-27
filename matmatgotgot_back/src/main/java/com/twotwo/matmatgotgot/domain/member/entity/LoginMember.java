package com.twotwo.matmatgotgot.domain.member.entity;

import java.time.LocalDateTime; // ◀ 최신 라이브러리로 변경!
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginMember {
    private String token;
    private String memberId;
    private String memberThumb;
    private String memberNickname;
    private boolean admin;
    private LocalDateTime validity; // ◀ LocalDateTime 사용
}