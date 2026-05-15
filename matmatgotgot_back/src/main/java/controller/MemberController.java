package controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.MemberDto;
import entity.MemberEntity;
import lombok.RequiredArgsConstructor;
import service.MemberService;

@CrossOrigin(value="*")
@RestController
@RequiredArgsConstructor
@RequestMapping(value="/members")
public class MemberController {
	
	private final MemberService memberService;
	
	@GetMapping
	public ResponseEntity<?> selectAllMembers() {
		List<MemberEntity> list = memberService.selectAllMembers();
		System.out.println(list);
		return ResponseEntity.ok(list);
	}
}
