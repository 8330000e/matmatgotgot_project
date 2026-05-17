package com.twotwo.dto;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import lombok.Data;

@Data
public class MemberDto {
    private String memberId;
    private String memberPw;
    private String memberName;
    private String memberEmail;
    private String memberNickname;
}
