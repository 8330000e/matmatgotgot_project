package com.twotwo.board.service;

import com.twotwo.board.entity.Board;
import com.twotwo.board.entity.ListItem;
import com.twotwo.board.entity.ListResponse;
import com.twotwo.board.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    //게시글 목록 조회
    public ListResponse selectBoardList(ListItem request) {
        Integer totalCount = boardRepository.selectBoardCount(request);
        int totalPage = (int) Math.ceil(totalCount / (double) request.getSize());
        List<Board> list = boardRepository.selectBoardList(request);
        ListResponse response = new ListResponse(list, totalPage);
        return response;
    }

    //게시글 등록
    @Transactional
    public int insertBoard(Board board) {
        int boardNo = boardRepository.getNewBoardNo();
        board.setBoardNo(boardNo);
        int result = boardRepository.inserBoard(board);
        return result;
    }
}
