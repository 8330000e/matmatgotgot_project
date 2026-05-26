package com.twotwo.matmatgotgot.domain.member.entity;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Alias(value="member")
public class Member {
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