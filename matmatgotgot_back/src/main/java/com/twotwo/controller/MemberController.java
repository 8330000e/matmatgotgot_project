package com.twotwo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twotwo.dto.response.MemberResponse;
import com.twotwo.mapper.MemberMapper;
import com.twotwo.response.ApiResponse;
import com.twotwo.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/members")
public class MemberController {
	
	private final MemberService memberService;
	
	@GetMapping
	public ResponseEntity<ApiResponse<List<MemberResponse>>> selectAll() {
		return ResponseEntity.ok(ApiResponse.success(memberService.selectAll()));
	}
}
