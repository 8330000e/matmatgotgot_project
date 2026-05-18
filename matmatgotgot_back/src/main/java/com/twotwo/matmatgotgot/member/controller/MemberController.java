package com.twotwo.matmatgotgot.member.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twotwo.matmatgotgot.member.dto.MemberDto;
import com.twotwo.matmatgotgot.member.mapper.MemberMapper;
import com.twotwo.matmatgotgot.member.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/members")
public class MemberController {
	
	private final MemberService memberService;
	
	@GetMapping
	public ResponseEntity<?> selectAllMembers() {
		List<MemberDto> list = memberService.selectAllMembers();
		System.out.println(list);
		return ResponseEntity.ok(list);
	}
}
