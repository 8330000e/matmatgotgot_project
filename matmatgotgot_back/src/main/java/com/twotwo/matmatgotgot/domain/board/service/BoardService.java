package com.twotwo.matmatgotgot.domain.board.service;

import com.twotwo.matmatgotgot.domain.board.entity.Board;
import com.twotwo.matmatgotgot.domain.board.entity.ListItem;
import com.twotwo.matmatgotgot.domain.board.entity.ListResponse;
import com.twotwo.matmatgotgot.domain.board.mapper.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BoardService {
    @Autowired
    private BoardMapper boardMapper;

    //게시글 목록 조회
    public ListResponse selectBoardList(ListItem request) {

        // page, size null 방지
        if (request.getPage() == null || request.getPage() < 1) {
            request.setPage(1);
        }

        if (request.getSize() == null || request.getSize() < 1) {
            request.setSize(10);
        }

        Integer totalCount = boardMapper.selectBoardCount(request);

        int totalPage =
                (int) Math.ceil(totalCount / (double) request.getSize());

        List<Board> list =
                boardMapper.selectBoardList(request);

        return new ListResponse(list, totalPage);
    }


    //게시글 등록
    @Transactional
    public int insertBoard(Board board) {
        int boardNo = boardMapper.getNewBoardNo();
        board.setBoardNo(boardNo);
        int result = boardMapper.inserBoard(board);
        return result;
    }

    //게시글 상세 조회
    public Board selectOneBoard(Integer boardNo) {
        return boardMapper.selectOneBoard(boardNo);
    }
}

