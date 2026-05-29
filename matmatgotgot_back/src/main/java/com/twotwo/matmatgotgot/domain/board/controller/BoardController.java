package com.twotwo.matmatgotgot.domain.board.controller;

import com.twotwo.matmatgotgot.domain.board.entity.Board;
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

        ListResponse response =
                boardService.selectBoardList(request);

        return ResponseEntity.ok(response);
    }

    // 이미지 업로드
    @PostMapping("/image-upload")
    public ResponseEntity<?> imageUpload(
            @ModelAttribute MultipartFile image
    ) {

        String savePath = root + "editor/";

        File dir = new File(savePath);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filePath =
                fileUtil.upload(savePath, image);

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

        String boardThumb =
                firstImg == null ? null : firstImg.attr("src");

        board.setBoardThumb(boardThumb);

        int result =
                boardService.insertBoard(board);

        return ResponseEntity.ok(result);
    }

    // 게시글 상세 조회
    @GetMapping("/{boardNo}")
    public ResponseEntity<?> selectOneBoard(
            @PathVariable Integer boardNo
    ) {

        Board board =
                boardService.selectOneBoard(boardNo);

        return ResponseEntity.ok(board);
    }
}