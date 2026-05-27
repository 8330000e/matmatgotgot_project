package com.twotwo.matmatgotgot.domain.member.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.twotwo.matmatgotgot.domain.member.dto.response.MemberResponse;
import com.twotwo.matmatgotgot.domain.member.entity.Member;
import com.twotwo.matmatgotgot.domain.member.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder bcrypt;

    public List<MemberResponse> selectAll() {
        List<Member> memberList = memberMapper.selectAll();
        return memberList.stream().map(MemberResponse::from).toList();
    }

    @Transactional
    public int insertMember(Member member) {
        String memberPw = member.getMemberPw();
        String encPw = bcrypt.encode(memberPw);
        member.setMemberPw(encPw);
        int result = memberMapper.insertMember(member);
        return result;
    }

    public Member login(Member member) {
        Member m = memberMapper.selectOneMember(member.getMemberId());
        member.setMemberId(m.getMemberId());
        Member loginMember = memberMapper.login(member);
        if(loginMember != null) {
            boolean result = bcrypt.matches(member.getMemberPw(), loginMember.getMemberPw());
            if(result) {
                return loginMember;
            } else {
                return null;
            }
        }
        return null;
    }

    public Member member(String email) {
        Member member = memberMapper.selectOneMemberByEmail(email);
        return member;
    }
}