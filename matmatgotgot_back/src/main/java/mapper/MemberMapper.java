package mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import dto.MemberDto;
import entity.MemberEntity;

@Mapper
public interface MemberMapper {

	List<MemberEntity> selectAllMembers();
}
