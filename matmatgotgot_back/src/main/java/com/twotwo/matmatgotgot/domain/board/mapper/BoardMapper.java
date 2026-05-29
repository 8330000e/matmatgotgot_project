package com.twotwo.matmatgotgot.domain.board.mapper;

import com.twotwo.matmatgotgot.domain.board.entity.Board;
import com.twotwo.matmatgotgot.domain.board.entity.ListItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardMapper {

    Integer selectBoardCount(ListItem request);

    List<Board> selectBoardList(ListItem request);

    int getNewBoardNo();

    int insertBoard(Board board);

    Board selectOneBoard(Integer boardNo);
}