package com.twotwo.board.controller;

import com.twotwo.board.entity.Board;
import com.twotwo.board.entity.ListItem;
import com.twotwo.board.entity.ListResponse;
import com.twotwo.board.service.BoardService;
import com.twotwo.entity.LoginMember;
import com.twotwo.security.JwtTokenProvider;
import com.twotwo.util.FileUtil;
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
}