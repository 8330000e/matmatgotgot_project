package com.twotwo.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.twotwo.entity.Member;
import com.twotwo.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;


@Repository
@RequiredArgsConstructor
public class MemberRepository {
    private final MemberMapper memberMapper;

    public List<Member> selectAll() {
        // memberMapper 안에 전체 조회하는 메소드 이름을 적어주면 돼요.
        // (보통 selectAll이나 findAll 등으로 만드니, 내 매퍼 파일에 적힌 이름으로 맞춰주세요!)
        return memberMapper.selectAll();
    }

    public int insertmember(Member member) {
        // TODO Auto-generated method stub
        return memberMapper.insertMember(member);
    }
}
