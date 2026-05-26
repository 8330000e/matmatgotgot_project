package com.twotwo.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.twotwo.dto.response.MemberResponse;
import com.twotwo.entity.Member;
import com.twotwo.exception.MemberNotFoundException;
import com.twotwo.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bcrypt;

    public List<MemberResponse> selectAll() {
        List<Member> memberList = memberRepository.selectAll(); 
        return memberList.stream().map(MemberResponse::from).toList();
    }

    @Transactional
    public int insertMember(Member member) {
        String memberPw = member.getMemberPw();
        String encPw = bcrypt.encode(memberPw);
        member.setMemberPw(encPw);
        int result = memberRepository.insertmember(member);
        return result;
    }

    public Member selectOneMember(String memberId) {
        Member m = memberRepository.selectOneMember(memberId);
        return m;
    }

    public Member login(Member member) {
        Member loginMember = memberRepository.login(member);
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
}