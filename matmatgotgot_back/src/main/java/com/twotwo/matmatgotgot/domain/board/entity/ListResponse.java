package com.twotwo.matmatgotgot.domain.board.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ListResponse {
    public ListResponse(List<Review> list, int totalPage2) {
        //TODO Auto-generated constructor stub
    }
    private List<Board> items;
    private Integer totalPage;
}

