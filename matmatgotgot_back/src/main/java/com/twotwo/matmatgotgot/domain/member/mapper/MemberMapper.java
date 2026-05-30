package com.twotwo.matmatgotgot.domain.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.twotwo.matmatgotgot.domain.member.entity.Member;

@Mapper
public interface MemberMapper {

	List<Member> selectAll();

    int insertMember(Member member);

    Member selectOneMember(String memberId);

    Member selectOneMemberByEmail(String email);

    int googleInsertMember(Member newMember);

    int loginLog(Long memberNo);

    int logoutLog(Long memberNo);

    int kakaoInsertMember(Member newMember);

    int naverInsertMember(Member newMember);
	
}
