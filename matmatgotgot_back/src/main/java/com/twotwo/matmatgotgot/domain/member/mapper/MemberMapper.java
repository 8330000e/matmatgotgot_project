package com.twotwo.matmatgotgot.domain.member.mapper;

import java.util.List;

import com.twotwo.matmatgotgot.domain.member.entity.Coords;
import org.apache.ibatis.annotations.Mapper;

import com.twotwo.matmatgotgot.domain.member.entity.Member;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {

	List<Member> selectAll();

    Integer insertMember(Member member);

    Member selectOneMember(String memberId);

    Member selectOneMemberByEmail(String email);

    int googleInsertMember(Member newMember);

    int loginLog(Long memberNo);

    int logoutLog(Long memberNo);

    int kakaoInsertMember(Member newMember);

    int updateLocation(@Param("memberNo") Long memberNo,
                       @Param("coords") Coords coords);

    int naverInsertMember(Member newMember);

    Member searchId(String memberId);
}
