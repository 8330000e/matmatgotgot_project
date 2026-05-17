package com.twotwo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.twotwo.dto.MemberDto;

@Mapper
public interface MemberMapper {

	List<MemberDto> selectAllMembers();
}
