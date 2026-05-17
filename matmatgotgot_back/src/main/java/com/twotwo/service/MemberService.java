package com.twotwo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.twotwo.dto.MemberDto;
import com.twotwo.entity.MemberEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final com.twotwo.mapper.MemberMapper memberMapper;

	public List<MemberDto> selectAllMembers() {
		List<MemberDto> list = memberMapper.selectAllMembers();
		System.out.println(list);
		return list;
	}
}
