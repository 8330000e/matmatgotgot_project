package com.twotwo.board.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("board")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Board {
    private Integer boardNo;
    private Long memberNo;
    private Integer boardCategory; //카테고리(0:전체, 1:여행후기, 2:자유게시글)
    private String boardTitle;
    private String boardContent;
    private String memberThumb;    //회원 프로필
    private String boardDate;
    private Integer boardStatus;   //게시글 상태(0:관리자 비공개/1:공개/2:삭제)
    private Integer placeNo;       //장소 번호
    private String boardThumb;
}
