package com.twotwo.matmatgotgot.domain.board.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ListResponse<T> {
    private List<T> items;
    private Integer totalPage;
}

