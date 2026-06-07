package com.twotwo.matmatgotgot.domain.restaurant.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
public class ReviewCreateResponse {

    private boolean success;
    private Long reviewNo;
}
