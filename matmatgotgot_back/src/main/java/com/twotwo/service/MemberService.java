package com.twotwo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.twotwo.dto.response.MemberResponse;
import com.twotwo.entity.Member;
import com.twotwo.exception.MemberNotFoundException;
import com.twotwo.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberRepository memberRepository;

    public List<MemberResponse> selectAll() {
        List<Member> memberList = memberRepository.selectAll(); 
        return memberList.stream().map(MemberResponse::from).toList();
    }
}