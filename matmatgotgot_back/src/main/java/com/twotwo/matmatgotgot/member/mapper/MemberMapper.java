package com.twotwo.matmatgotgot.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.twotwo.matmatgotgot.member.dto.MemberDto;


@Mapper
public interface MemberMapper {

	List<MemberDto> selectAllMembers();
}
