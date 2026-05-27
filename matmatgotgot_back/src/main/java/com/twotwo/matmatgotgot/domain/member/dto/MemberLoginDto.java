package com.twotwo.matmatgotgot.domain.member.dto; // 패키지 경로에 맞게 수정

public class MemberLoginDto {
    private String memberId;
    private String memberPw;

    // 기본 생성자, Getter, Setter 필수! (Lombok이 있다면 @Data 나 @Getter/@Setter 추가)
    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }
    public String getMemberPw() { return memberPw; }
    public void setMemberPw(String memberPw) { this.memberPw = memberPw; }
}