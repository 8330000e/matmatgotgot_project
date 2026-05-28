package com.twotwo.matmatgotgot.domain.member.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.twotwo.matmatgotgot.domain.member.dto.response.MemberResponse;
import com.twotwo.matmatgotgot.domain.member.entity.LoginMember;
import com.twotwo.matmatgotgot.domain.member.entity.Member;
import com.twotwo.matmatgotgot.domain.member.mapper.MemberMapper;
import com.twotwo.matmatgotgot.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder bcrypt;
    private final JwtTokenProvider jwtTokenProvider;

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

    public Member member(String email) {
        Member member = memberMapper.selectOneMemberByEmail(email);
        return member;
    }

    public LoginMember login(Member member) {
        Member loginmember  = memberMapper.selectOneMember(member.getMemberId());
        if(loginmember != null && bcrypt.matches(member.getMemberPw(), loginmember.getMemberPw())) {
            LoginMember login = jwtTokenProvider.createToken(loginmember.getMemberId(),loginmember.getMemberNickname(),false);
            if(login != null) {
                int result = memberMapper.loginLog(loginmember.getMemberNo());
                if(result > 0) {
                    return login;
                }
            }
            } else {
                return null;
            }
        return null;
    }

    @Transactional
    public int insertMemberG(Member newMember) {
        String memberPw = newMember.getMemberPw();
        String encPw = bcrypt.encode(memberPw);
        newMember.setMemberPw(encPw);
        int result = memberMapper.insertMember(newMember);
        if(result > 0) {
            int socialResult = memberMapper.googleInsertMember(newMember);
            memberMapper.loginLog(newMember.getMemberNo());
            return socialResult;
        }
        return -1;
    }

    public Member findMember(String memberId) {
        Member member = memberMapper.selectOneMember(memberId);
        return member;
    }

    @Transactional
    public boolean logout(String memberId) {
        Member loginMember = memberMapper.selectOneMember(memberId);
        if (loginMember != null) {
            int result = memberMapper.logoutLog(loginMember.getMemberNo());
            return result > 0; 
        }
        
        return false;
    }
}