package service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dto.MemberDto;
import entity.MemberEntity;
import lombok.RequiredArgsConstructor;
import mapper.MemberMapper;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberMapper memberMapper;

	public List<MemberEntity> selectAllMembers() {
		return memberMapper.selectAllMembers();
	}
}
