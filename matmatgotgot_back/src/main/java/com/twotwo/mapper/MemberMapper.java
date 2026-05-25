package com.twotwo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.twotwo.entity.Member;

@Mapper
public interface MemberMapper {

	List<Member> selectAll();

    int insertMember(Member member);
	
}
