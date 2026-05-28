package com.twotwo.matmatgotgot.domain.member.controller;

import com.twotwo.matmatgotgot.global.util.EmailSender;

import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.twotwo.matmatgotgot.domain.member.dto.LoginResponseDto;
import com.twotwo.matmatgotgot.domain.member.dto.MemberLoginDto;
import com.twotwo.matmatgotgot.domain.member.dto.response.MemberResponse;
import com.twotwo.matmatgotgot.domain.member.entity.LoginMember;
import com.twotwo.matmatgotgot.domain.member.entity.Member;
import com.twotwo.matmatgotgot.domain.member.service.MemberService;
import com.twotwo.matmatgotgot.global.response.ApiResponse;
import com.twotwo.matmatgotgot.security.GoogleOAuthService;
import com.twotwo.matmatgotgot.security.GoogleUserProfile;
import com.twotwo.matmatgotgot.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/members")
public class MemberController {
	
	private final EmailSender emailSender;
    private final MemberService memberService;
	private final GoogleOAuthService googleOAuthService;
	private final JwtTokenProvider jwtTokenProvider;
	
	@GetMapping
	public ResponseEntity<?> selectAll() {
		return ResponseEntity.ok(ApiResponse.success(memberService.selectAll()));
	}

	@PostMapping
	public ResponseEntity<?> insertMember(@RequestBody Member member) {
		int result = memberService.insertMember(member);
		return ResponseEntity.ok(result);
	}

	@PostMapping(value="/login")
	public ResponseEntity<?> login(@RequestBody MemberLoginDto dto) {
		Member loginInput = new Member();
		loginInput.setMemberNo(dto.getMemberNo());
		loginInput.setMemberId(dto.getMemberId());
		loginInput.setMemberPw(dto.getMemberPw());

		LoginMember loginLog = memberService.login(loginInput);

		if (loginLog == null) {
			return ResponseEntity.status(401).body("로그인 정보가 올바르지 않습니다.");
		}

		Member member = memberService.findMember(dto.getMemberId());
		LoginMember loginMember = jwtTokenProvider.createToken(member.getMemberId(), member.getMemberNickname(), member.isAdmin());

		LoginResponseDto response = new LoginResponseDto();
		response.setMemberNo(loginMember.getMemberNo());
		response.setMemberId(loginMember.getMemberId());
		response.setMemberNickname(loginMember.getMemberNickname());
		response.setMemberThumb(member.getMemberThumb());
		response.setAdmin(loginMember.isAdmin());
		response.setToken(loginMember.getToken());

		long validityMilli = loginMember.getValidity().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
		response.setValidity(validityMilli);

		return ResponseEntity.ok(response);
	}

	// @PostMapping(value="/login")
	// public ResponseEntity<?> login(@RequestBody Member member) {
	// 	LoginMember loginMember = memberService.login(member);
	// 	if(loginMember == null) {
	// 		return ResponseEntity.status(404).build();
	// 	}else{
	// 		return ResponseEntity.ok(loginMember);
	// 	}
	// }

	@PostMapping("/logout/{currentId}")
	public ResponseEntity<?> logout(@PathVariable("currentId") String memberId) {
		
		boolean isSuccess = memberService.logout(memberId);
		System.out.println("로그아웃 시도한 회원 ID: " + memberId);
		
		if(isSuccess) {
			return ResponseEntity.ok("로그아웃 성공");
		} else {
			return ResponseEntity.status(404).body("존재하지 않는 회원입니다.");
		}
	}

	@PostMapping("/login/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        
        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body("인가 코드가 없습니다.");
        }

        // STEP 1: 인가 코드로 구글 Access Token 받아오기
        String accessToken = googleOAuthService.getGoogleAccessToken(code);
        
        // STEP 2: Access Token으로 구글 유저 프로필(이메일, 이름 등) 가져오기
        GoogleUserProfile googleUser = googleOAuthService.getGoogleUserProfile(accessToken);
        
        // 확인용 로그
        System.out.println("구글 로그인 유저 이메일: " + googleUser.getEmail());
        System.out.println("구글 로그인 유저 이름: " + googleUser.getName());

		Member member = memberService.member(googleUser.getEmail());
		if(member == null) {
			// DB에 해당 이메일로 가입된 회원이 없으므로, 신규 회원으로 판단하여 DB에 자동으로 회원가입 시키기
			String googleId = googleUser.getId();

			Member newMember = new Member();
			newMember.setMemberId(googleId);
			newMember.setMemberEmail(googleUser.getEmail());
			newMember.setMemberName(googleUser.getName());
			// 구글 로그인은 비밀번호가 없으므로, 랜덤한 문자열을 비밀번호로 설정해줍니다.
			newMember.setMemberPw("google" + googleId); // 예시: "google_1234567890"
			newMember.setMemberNickname("google_" + googleId);
			System.out.println(googleId);
			int loginMember = memberService.insertMemberG(newMember);
			member = newMember; // 가입된 회원 정보로 member 변수 업데이트
			if(loginMember > 0) {
				return ResponseEntity.status(404).build();
			}else{
				return ResponseEntity.ok(loginMember);
			}
		} else {
			LoginMember loginMember = memberService.login(member);
			if(loginMember!=null) {
				System.out.println("기존 회원 로그인 처리 완료: " + member.getMemberEmail());
			}
		}
        return ResponseEntity.ok(googleUser); // 테스트를 위해 우선 유저 정보를 리턴
    }

	@PostMapping(value="/login/kakao")
	public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> request) {
		String code = request.get("code");

		if (code == null || code.isEmpty()) {
			return ResponseEntity.badRequest().body("인가 코드가 없습니다.");
		}

		return ResponseEntity.ok("카카오 로그인은 아직 구현되지 않았습니다.");
	}

	@PostMapping(value="/email-verification")
	public ResponseEntity<?> sendMail(@RequestBody Member member) {
		String emailTitle = "[맛맛곳곳] 회원가입 인증 메일입니다.";
		Random r = new Random();
		StringBuffer sb = new StringBuffer();
		for(int i=0; i<6; i++) {
			int num = r.nextInt(10);
			sb.append(num);
		}
		int flag = r.nextInt(3);
		if(flag == 0) {
			int randomCode = r.nextInt(10);
			sb.append(randomCode);
		}else if(flag == 1) {
			char randomCode = (char)(r.nextInt(26)+65);
			sb.append(randomCode);
		}else if(flag == 2) {
			char randomCode = (char)(r.nextInt(26)+97);
			sb.append(randomCode);
		}
		String authCode = sb.toString();
		String emailContent = "<!doctypehtml><htmllang=\"ko\"><head><metacharset=\"UTF-8\"/><metaname=\"viewport\"content=\"width=device-width,initial-scale=1.0\"/></head><body style=\"width:500px;margin:0auto;padding:0;background-color:#fdfbf7\"><div style=\"display:flex;align-items:center;justify-content:center;margin-top:50px;margin-bottom:15px;text-align:center;padding:10px;gap:8px;\"><img src=\"matmatgotgot_front\\scr\\assets\\logo\\맛맛곳곳로고_300x398.png\"alt=\"\"style=\"width:40px;margin-top:50px\"/><div style=\"margin-top:50px;font-weight:900;font-size:40px;color:#2b1b17;\">맛맛곳곳</div></div><div style=\"background-color:#fff;padding:30px50px;text-align:center;box-shadow:02px8pxrgba(0,0,0,0.2);border-radius:15px;\"><div><div style=\"display:flex;flex-direction:column;align-items:center;gap:20px;\"><p style=\"font-size:16px;color:#2b1b17;font-weight:500\">안녕하세요! 맛맛곳곳입니다.<br/>아래 코드를 복사하여 이메일 인증을 완료하여 주십시오.</p><div style=\"width:180px;border:1pxsolid#2b1b17;border-radius:10px\"><div style=\"padding:10px;font-weight:bold;font-size:24px;color:#2b1b17;\">ArdKJR</div></div><div style=\"display:flex;flex-direction:column;align-items:center;margin-top:20px;gap:10px;\"><p style=\"margin-top:20px;font-size:13px;color:#2b1b17;font-weight:500;\">본인이 요청한 이메일 인증이 아니라면, 이 이메일을 무시하셔도 됩니다.</p></div></div></div></div><div style=\"font-size:12px;color:#2b1b17;text-align:center;margin-top:20px;font-weight:500;opacity:0.7;\">'맛맛곳곳'은 KH정보교육원 종로 301반 파이널프로젝트로,<br/>팀 twotwo에서 제작 및 배포했습니다.</div></body></html>";
						emailSender.sendMail(emailTitle, member.getMemberEmail(), emailContent);
		return ResponseEntity.ok(ApiResponse.success(authCode));
	}
}
