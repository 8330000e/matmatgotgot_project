package com.twotwo.matmatgotgot.domain.board.service;

import com.twotwo.matmatgotgot.domain.board.entity.Board;
import com.twotwo.matmatgotgot.domain.board.entity.ListItem;
import com.twotwo.matmatgotgot.domain.board.entity.ListResponse;
import com.twotwo.matmatgotgot.domain.board.mapper.BoardMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;

    // 게시글 목록 조회
    public ListResponse selectBoardList(ListItem request) {

        if (request.getPage() == null || request.getPage() < 0) {
            request.setPage(0);
        }

        if (request.getSize() == null || request.getSize() < 1) {
            request.setSize(8);
        }

        request.setOffset(
                request.getPage() * request.getSize()
        );

        Integer totalCount =
                boardMapper.selectBoardCount(request);

        int totalPage =
                (int)Math.ceil(totalCount / (double)request.getSize());

        List<Board> list =
                boardMapper.selectBoardList(request);

        return new ListResponse(list, totalPage);
    }

    // 게시글 등록
    @Transactional
    public int insertBoard(Board board) {

        return boardMapper.insertBoard(board);
    }

    // 상세 조회
    public Board selectOneBoard(Integer boardNo) {

        return boardMapper.selectOneBoard(boardNo);
    }
}