package com.twotwo.matmatgotgot.domain.board.service;

import com.twotwo.matmatgotgot.domain.board.entity.Board;
import com.twotwo.matmatgotgot.domain.board.entity.BoardComment;
import com.twotwo.matmatgotgot.domain.board.entity.ListItem;
import com.twotwo.matmatgotgot.domain.board.entity.ListResponse;
import com.twotwo.matmatgotgot.domain.board.mapper.BoardMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import com.twotwo.matmatgotgot.security.JwtTokenProvider;


@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;
    private final JwtTokenProvider jwtTokenProvider;

    // 로그인 회원 번호 가져오기
    private Long getLoginMemberNo(String token) {
        /*
        // 로그인 구현 완료 시 사용할 코드
        String memberId =
                jwtTokenProvider.getMemberId(token);

        return boardMapper.selectMemberNo(memberId);
        */

        // 로그인 구현 전 테스트용 코드
        if (token == null || token.isBlank()) {
            return 1L;
        }

        String memberId =
                jwtTokenProvider.getMemberId(token);

        return boardMapper.selectMemberNo(memberId);
        //여기까지 지움
    }


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

    // 게시글 수정
    @Transactional
    public int updateBoard(Board board) {
        return boardMapper.updateBoard(board);
    }

    // 게시글 삭제
    @Transactional
    public int deleteBoard(Integer boardNo) {
        return boardMapper.deleteBoard(boardNo);
    }

    // 상세 조회
    public Board selectOneBoard(Integer boardNo) {

        return boardMapper.selectOneBoard(boardNo);
    }

    @Transactional
    public Integer getOrCreatePlaceNo(Board board) {

        Integer placeNo =
                boardMapper.selectPlaceNo(board);

        if (placeNo != null) {
            return placeNo;
        }

        boardMapper.insertPlace(board);

        return board.getPlaceNo();
    }

    //좋아요 조회
    public Map<String, Object> selectLikeInfo(
            Integer boardNo,
            String token
    ) {

        int likeCount =
                boardMapper.selectLikeCount(boardNo);

        Map<String, Object> likeInfo =
                new HashMap<>();

        likeInfo.put("likeCount", likeCount);

        if (token != null && !token.isBlank()) {

            Long memberNo =
                    getLoginMemberNo(token);

            Map<String, Object> params =
                    new HashMap<>();

            params.put("boardNo", boardNo);
            params.put("memberNo", memberNo);

            int isLike =
                    boardMapper.selectIsLike(params);

            likeInfo.put("isLike", isLike);

        } else {
            likeInfo.put("isLike", 0);
        }

        return likeInfo;
    }

    // 좋아요 등록
    @Transactional
    public int insertLike(
            Integer boardNo,
            String token
    ) {

        Long memberNo =
                getLoginMemberNo(token);

        Map<String, Object> map =
                new HashMap<>();

        map.put("boardNo", boardNo);
        map.put("memberNo", memberNo);

        return boardMapper.insertLike(map);
    }

    //좋아요 취소
    @Transactional
    public int deleteLike(
            Integer boardNo,
            String token
    ) {

        Long memberNo =
                getLoginMemberNo(token);

        Map<String, Object> map =
                new HashMap<>();

        map.put("boardNo", boardNo);
        map.put("memberNo", memberNo);

        return boardMapper.deleteLike(map);
    }

    //신고 조회
    public Map<String, Object> selectReportInfo(
            Integer boardNo,
            String token
    ) {

        int reportCount =
                boardMapper.selectReportCount(boardNo);

        Map<String, Object> reportInfo =
                new HashMap<>();

        reportInfo.put(
                "reportCount",
                reportCount
        );

        if (token != null && !token.isBlank()) {

            Long memberNo =
                    getLoginMemberNo(token);

            Map<String, Object> params =
                    new HashMap<>();

            params.put("boardNo", boardNo);
            params.put("memberNo", memberNo);

            int isReport =
                    boardMapper.selectIsReport(params);

            reportInfo.put(
                    "isReport",
                    isReport
            );

        } else {

            reportInfo.put(
                    "isReport",
                    0
            );
        }

        return reportInfo;
    }

    // 신고 등록
    @Transactional
    public int insertReport(
            Integer boardNo,
            String token
    ) {

        Long memberNo =
                getLoginMemberNo(token);

        Map<String, Object> map =
                new HashMap<>();

        map.put("boardNo", boardNo);
        map.put("memberNo", memberNo);

        return boardMapper.insertReport(map);
    }

    // 신고 취소
    @Transactional
    public int deleteReport(
            Integer boardNo,
            String token
    ) {

        Long memberNo =
                getLoginMemberNo(token);

        Map<String, Object> map =
                new HashMap<>();

        map.put("boardNo", boardNo);
        map.put("memberNo", memberNo);

        return boardMapper.deleteReport(map);
    }

    //댓글 등록
    @Transactional
    public BoardComment insertComment(
            BoardComment comment,
            String token
    ) {

        Long memberNo =
                getLoginMemberNo(token);

        comment.setMemberNo(memberNo);

        boardMapper.insertComment(comment);

        return boardMapper.selectOneComment(
                comment.getBoardCommentNo()
        );
    }
    // 댓글 목록 조회
    public List<BoardComment> selectCommentList(
            Integer boardNo
    ) {
        return boardMapper.selectCommentList(boardNo);
    }
    // 댓글 수정
    @Transactional
    public int updateComment(BoardComment comment) {
        return boardMapper.updateComment(comment);
    }
}