package com.twotwo.matmatgotgot.domain.restaurant.dto.response;

import com.twotwo.matmatgotgot.domain.restaurant.entity.Recommand;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class RecommandResponse {

    List<Recommand> popular;
    List<Recommand> like;
}
