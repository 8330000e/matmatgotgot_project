package com.twotwo.entity;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value="member")
public class MemberEntity {
    private Long id;
    private String memberId;
    private String memberPw;
    private String memberName;
    private String memberEmail;
    private String memberNickname;
    private String memberThumb;
    private int memberStatus;
    private LocalDateTime enrollDate;
}