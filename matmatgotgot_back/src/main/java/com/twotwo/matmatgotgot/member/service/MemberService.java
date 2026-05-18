package com.twotwo.matmatgotgot.member.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.twotwo.matmatgotgot.member.dto.MemberDto;
import com.twotwo.matmatgotgot.member.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberMapper memberMapper;

	public List<MemberDto> selectAllMembers() {
		List<MemberDto> list = memberMapper.selectAllMembers();
		System.out.println(list);
		return list;
	}
}
