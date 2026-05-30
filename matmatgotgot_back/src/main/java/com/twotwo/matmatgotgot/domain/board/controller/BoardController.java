package com.twotwo.matmatgotgot.domain.board.controller;

import com.twotwo.matmatgotgot.domain.board.entity.Board;
import com.twotwo.matmatgotgot.domain.board.entity.BoardComment;
import com.twotwo.matmatgotgot.domain.board.entity.ListItem;
import com.twotwo.matmatgotgot.domain.board.entity.ListResponse;
import com.twotwo.matmatgotgot.domain.board.service.BoardService;
import com.twotwo.matmatgotgot.global.util.FileUtil;

import lombok.RequiredArgsConstructor;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@CrossOrigin("*")
@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final FileUtil fileUtil;

    @Value("${file.root}")
    private String root;

    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<?> selectBoardList(
            @ModelAttribute ListItem request
    ) {
        ListResponse response = boardService.selectBoardList(request);
        return ResponseEntity.ok(response);
    }

    // 이미지 업로드 (원래 코드 유지)
    @PostMapping("/image-upload")
    public ResponseEntity<?> imageUpload(
            @ModelAttribute MultipartFile image
    ) {
        String savePath = root + "editor/";
        File dir = new File(savePath);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filePath = fileUtil.upload(savePath, image);
        return ResponseEntity.ok(filePath);
    }

    // 게시글 등록
    @PostMapping
    public ResponseEntity<?> insertBoard(
            @RequestBody Board board
    ) {
        // 첫 번째 이미지 추출
        Document doc = Jsoup.parse(board.getBoardContent());
        Element firstImg = doc.selectFirst("img");
        String boardThumb = null;

        if (firstImg != null) {
            String imgSrc = firstImg.attr("src");

            // 주소에 어떤 도메인이나 쿼리 스트링이 붙어있든 상관없이 오직 순수한 파일명(예: b5dbbf41-c310-....jpg)만 안전하게 추출
            if (imgSrc.contains("/editor/")) {
                // /editor/ 뒷부분만 싹 잘라냄
                boardThumb = imgSrc.substring(imgSrc.lastIndexOf("/editor/") + 8);
            } else if (imgSrc.contains("/")) {
                boardThumb = imgSrc.substring(imgSrc.lastIndexOf("/") + 1);
            } else {
                boardThumb = imgSrc;
            }

            // 물음표(?)나 파라미터가 뒤에 붙어있을 경우를 대비해 순수 파일명만 한 번 더 정제
            if (boardThumb.contains("?")) {
                boardThumb = boardThumb.substring(0, boardThumb.indexOf("?"));
            }
        }

        // DB에 'b5dbbf41-c310-4c88-86ba-7dff76bb10df.jpg' 같은 파일명만 들어감
        // 이렇게 저장되어야 리액트 BoardList.jsx의 `${import.meta.env.VITE_BACKSERVER}/editor/${board.boardThumb}` 코드와 결합됨
        board.setBoardThumb(boardThumb);

        // placeNo가 없더라도 직접 입력한 장소명과 주소가 들어왔다면 DB에서 조회하거나 새로 생성
        if (board.getPlaceNo() == null && board.getPlaceName() != null && board.getAddressName() != null) {
            if (board.getPlaceLat() == null) board.setPlaceLat(0.0);
            if (board.getPlaceLng() == null) board.setPlaceLng(0.0);

            Integer generatedPlaceNo = boardService.getOrCreatePlaceNo(board);
            board.setPlaceNo(generatedPlaceNo);
        }

        int result = boardService.insertBoard(board);
        return ResponseEntity.ok(result);
    }

    // 게시글 상세 조회
    @GetMapping("/{boardNo}")
    public ResponseEntity<?> selectOneBoard(
            @PathVariable Integer boardNo
    ) {
        Board board = boardService.selectOneBoard(boardNo);
        return ResponseEntity.ok(board);
    }

    // 좋아요 정보 조회
    @GetMapping("/{boardNo}/likes")
    public ResponseEntity<?> selectLikeInfo(
            @PathVariable Integer boardNo,
            @RequestHeader(
                    required = false,
                    name = "Authorization"
            ) String token
    ) {
        return ResponseEntity.ok(
                boardService.selectLikeInfo(boardNo, token)
        );
    }

    // 좋아요
    @PostMapping("/{boardNo}/likes")
    public ResponseEntity<?> likeOn(
            @PathVariable Integer boardNo,
            @RequestHeader(name = "Authorization")
            String token
    ) {
        int result =
                boardService.insertLike(boardNo, token);

        return ResponseEntity.ok(result);
    }

    // 좋아요 취소
    @DeleteMapping("/{boardNo}/likes")
    public ResponseEntity<?> likeOff(
            @PathVariable Integer boardNo,
            @RequestHeader(name = "Authorization")
            String token
    ) {
        int result =
                boardService.deleteLike(boardNo, token);

        return ResponseEntity.ok(result);
    }


    // 신고 정보 조회
    @GetMapping("/{boardNo}/reports")
    public ResponseEntity<?> selectReportInfo(
            @PathVariable Integer boardNo,
            @RequestHeader(
                    required = false,
                    name = "Authorization"
            ) String token
    ) {
        return ResponseEntity.ok(
                boardService.selectReportInfo(boardNo, token)
        );
    }

    // 신고
    @PostMapping("/{boardNo}/reports")
    public ResponseEntity<?> reportOn(
            @PathVariable Integer boardNo,
            @RequestHeader(name = "Authorization")
            String token
    ) {
        int result =
                boardService.insertReport(boardNo, token);

        return ResponseEntity.ok(result);
    }

    // 신고 취소
    @DeleteMapping("/{boardNo}/reports")
    public ResponseEntity<?> reportOff(
            @PathVariable Integer boardNo,
            @RequestHeader(name = "Authorization")
            String token
    ) {
        int result =
                boardService.deleteReport(boardNo, token);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/comments")
    public ResponseEntity<?> insertComment(
            @RequestBody BoardComment comment,
            @RequestHeader("Authorization")
            String token
    ) {
        BoardComment result =
                boardService.insertComment(comment, token);

        return ResponseEntity.ok(result);
    }

    // 댓글 목록 조회
    @GetMapping("/{boardNo}/comments")
    public ResponseEntity<?> selectCommentList(
            @PathVariable Integer boardNo
    ) {
        return ResponseEntity.ok(
                boardService.selectCommentList(boardNo)
        );
    }
}