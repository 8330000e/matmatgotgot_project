package com.twotwo.matmatgotgot.member.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginMember {
	private Long memberNo;
    private String memberId;
    private String memberPw;
    private String memberName;
    private String memberEmail;
    private String memberNickname;
    private String memberThumb;
    private int memberStatus;
    private LocalDateTime enrollDate;
    private boolean admin;
    private String socialLogin;
}

