package com.twotwo.matmatgotgot.domain.board.controller;

import com.twotwo.matmatgotgot.domain.board.entity.Board;
import com.twotwo.matmatgotgot.domain.board.entity.ListItem;
import com.twotwo.matmatgotgot.domain.board.entity.ListResponse;
import com.twotwo.matmatgotgot.domain.board.service.BoardService;
import com.twotwo.matmatgotgot.domain.member.entity.LoginMember;
import com.twotwo.matmatgotgot.security.JwtTokenProvider;
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
@RequestMapping("/boards")
@RestController
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final FileUtil fileUtil;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${file.root}")
    private String root;

    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<?> selectBoardList(
            @ModelAttribute ListItem request,
            @RequestHeader(required = false, name = "Authorization") String token
    ) {

        if (token != null && !token.equals("null")) {

            // Bearer 제거
            token = token.replace("Bearer ", "");

            String memberId = jwtTokenProvider.getMemberId(token);

            // 관리자 여부는 나중에 DB 조회 붙이면 됨
            request.setAdmin(false);

        } else {

            request.setAdmin(false);
        }

        ListResponse response = boardService.selectBoardList(request);

        return ResponseEntity.ok(response);
    }

    // 이미지 업로드
    @PostMapping("/image-upload")
    public ResponseEntity<?> imageUpload(@ModelAttribute MultipartFile image) {

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
            @ModelAttribute Board board,
            @RequestHeader(name = "Authorization") String token
    ) {

        token = token.replace("Bearer ", "");

        String memberId = jwtTokenProvider.getMemberId(token);

        // 썸네일 추출
        Document doc = Jsoup.parse(board.getBoardContent());

        Element firstImg = doc.selectFirst("img");

        String boardThumb =
                firstImg == null ? null : firstImg.attr("src");

        board.setBoardThumb(boardThumb);

        int result = boardService.insertBoard(board);

        return ResponseEntity.ok(result);
    }

    // 게시글 상세 조회
    @GetMapping("/{boardNo}")
    public ResponseEntity<?> selectOneBoard(@PathVariable Integer boardNo,
                                            @RequestHeader(required = false, name="Authorization") String token) {
        Board board = boardService.selectOneBoard(boardNo);
        // 게시글이 존재하지 않을 때
        if(board == null) return ResponseEntity.status(404).build();
        // 비공개 글(0)인 경우 권한 체크
        if(board.getBoardStatus() == 0) {
            // 로그인 안 한 경우
            if (token == null || token.equals("null")) {
                return ResponseEntity.status(403)
                        .body("비공개 게시글입니다.");
            }
            try {
                // Bearer 제거
                token = token.replace("Bearer ", "");

                // 토큰에서 memberId 추출
                String memberId =
                        jwtTokenProvider.getMemberId(token);

                // TODO:
                // 실제로는 DB 조회해서
                // 작성자 여부 / 관리자 여부 체크 필요

                // 임시 처리
                boolean isAdmin = false;
                boolean isWriter = false;

                if (!isAdmin && !isWriter) {
                    return ResponseEntity.status(403)
                            .body("접근 권한이 없습니다.");
                }

            } catch (Exception e) {

                return ResponseEntity.status(401)
                        .body("유효하지 않은 토큰입니다.");
            }
        }
        return ResponseEntity.ok(board);
    }
}
