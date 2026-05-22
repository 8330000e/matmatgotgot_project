package com.twotwo.controller;

import com.twotwo.util.EmailSender;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twotwo.dto.response.MemberResponse;
import com.twotwo.entity.Member;
import com.twotwo.response.ApiResponse;
import com.twotwo.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/members")
public class MemberController {
	
	private final EmailSender emailSender;
    private final MemberService memberService;
	
	@GetMapping
	public ResponseEntity<ApiResponse<List<MemberResponse>>> selectAll() {
		return ResponseEntity.ok(ApiResponse.success(memberService.selectAll()));
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
		String emailContent = 
		"<body\r\n" + //
						"    style=\"width: 500px; margin: 0 auto; padding: 0; background-color: #fdfbf7\"\r\n" + //
						"  >\r\n" + //
						"    <div\r\n" + //
						"      style=\"\r\n" + //
						"        display: flex;\r\n" + //
						"        align-items: center;\r\n" + //
						"        justify-content: center;\r\n" + //
						"        margin-top: 50px;\r\n" + //
						"        margin-bottom: 15px;\r\n" + //
						"        text-align: center;\r\n" + //
						"        padding: 10px;\r\n" + //
						"        gap: 8px;\r\n" + //
						"      \"\r\n" + //
						"    >\r\n" + //
						"      <img\r\n" + //
						"        src=\"matmatgotgot_front\\scr\\assets\\logo\\맛맛곳곳로고_300x398.png\"\r\n" + //
						"        alt=\"\"\r\n" + //
						"        style=\"width: 40px; margin-top: 50px\"\r\n" + //
						"      />\r\n" + //
						"      <div\r\n" + //
						"        style=\"\r\n" + //
						"          margin-top: 50px;\r\n" + //
						"          font-weight: 900;\r\n" + //
						"          font-size: 40px;\r\n" + //
						"          color: #2b1b17;\r\n" + //
						"        \"\r\n" + //
						"      >\r\n" + //
						"        맛맛곳곳\r\n" + //
						"      </div>\r\n" + //
						"    </div>\r\n" + //
						"    <div\r\n" + //
						"      style=\"\r\n" + //
						"        background-color: #fff;\r\n" + //
						"        padding: 30px 50px;\r\n" + //
						"        text-align: center;\r\n" + //
						"        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\r\n" + //
						"        border-radius: 15px;\r\n" + //
						"      \"\r\n" + //
						"    >\r\n" + //
						"      <div>\r\n" + //
						"        <div\r\n" + //
						"          style=\"\r\n" + //
						"            display: flex;\r\n" + //
						"            flex-direction: column;\r\n" + //
						"            align-items: center;\r\n" + //
						"            gap: 20px;\r\n" + //
						"          \"\r\n" + //
						"        >\r\n" + //
						"          <p style=\"font-size: 16px; color: #2b1b17; font-weight: 500\">\r\n" + //
						"            안녕하세요! 맛맛곳곳입니다.<br />아래 코드를 복사하여 이메일 인증을\r\n" + //
						"            완료하여주십시오.\r\n" + //
						"          </p>\r\n" + //
						"          <div\r\n" + //
						"            style=\"width: 180px; border: 1px solid #2b1b17; border-radius: 10px\"\r\n" + //
						"          >\r\n" + //
						"            <div\r\n" + //
						"              style=\"\r\n" + //
						"                padding: 10px;\r\n" + //
						"                font-weight: bold;\r\n" + //
						"                font-size: 24px;\r\n" + //
						"                color: #2b1b17;\r\n" + //
						"              \"\r\n" + //
						"            >\r\n" + //
						"              " + authCode + "\r\n" + //
						"            </div>\r\n" + //
						"          </div>\r\n" + //
						"          <div\r\n" + //
						"            style=\"\r\n" + //
						"              flex-direction: column;\r\n" + //
						"              align-items: center;\r\n" + //
						"              margin-top: 20px;\r\n" + //
						"              gap: 10px;\r\n" + //
						"            \"\r\n" + //
						"          >\r\n" + //
						"            <p\r\n" + //
						"              style=\"\r\n" + //
						"                margin-top: 20px;\r\n" + //
						"                font-size: 13px;\r\n" + //
						"                color: #2b1b17;\r\n" + //
						"                font-weight: 500;\r\n" + //
						"              \"\r\n" + //
						"            >\r\n" + //
						"              본인이 요청한 이메일 인증이 아니라면, 이 이메일을 무시하셔도\r\n" + //
						"              됩니다.\r\n" + //
						"            </p>\r\n" + //
						"          </div>\r\n" + //
						"        </div>\r\n" + //
						"      </div>\r\n" + //
						"    </div>\r\n" + //
						"    <div\r\n" + //
						"      style=\"\r\n" + //
						"        font-size: 12px;\r\n" + //
						"        color: #2b1b17;\r\n" + //
						"        text-align: center;\r\n" + //
						"        margin-top: 20px;\r\n" + //
						"        font-weight: 500;\r\n" + //
						"        opacity: 0.7;\r\n" + //
						"      \"\r\n" + //
						"    >\r\n" + //
						"      '맛맛곳곳'은 KH정보교육원 종로 301반 파이널 프로젝트로,<br />팀 twotwo에서\r\n" + //
						"      제작 및 배포했습니다.\r\n" + //
						"    </div>\r\n" + //
						"  </body>";
						emailSender.sendMail(emailTitle, member.getMemberEmail(), emailContent);
		return ResponseEntity.ok(ApiResponse.success(authCode));
	}
}
