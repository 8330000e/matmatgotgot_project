package com.twotwo.matmatgotgot.member.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.twotwo.matmatgotgot.member.dto.MemberDto;
import com.twotwo.matmatgotgot.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberRepository memberRepository;

	public List<MemberDto> selectAllMembers() {
		List<MemberDto> list = memberRepository.selectAllMembers();
		System.out.println(list);
		return list;
	}
}
