package com.twotwo.matmatgotgot.member.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.twotwo.matmatgotgot.member.dto.MemberDto;
import com.twotwo.matmatgotgot.member.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MemberRepository {

    private final MemberMapper memberMapper;

    public List<MemberDto> selectAllMembers() {
        return memberMapper.selectAllMembers();
    }
    
}
