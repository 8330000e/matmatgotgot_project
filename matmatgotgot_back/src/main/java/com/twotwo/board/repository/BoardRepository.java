package com.twotwo.board.repository;

import com.twotwo.board.entity.Board;
import com.twotwo.board.entity.ListItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardRepository {
    Integer selectBoardCount(ListItem request);

    List<Board> selectBoardList(ListItem request);

    int getNewBoardNo();

    int inserBoard(Board board);
}
