package com.twotwo.matmatgotgot.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.twotwo.matmatgotgot.member.entity.Member;

@Mapper
public interface MemberMapper {

	List<Member> selectAll();

    int insertMember(Member member);

    Member selectOneMember(String memberId);

    Member login(Member member);

    Member selectOneMemberByEmail(String email);
	
}
