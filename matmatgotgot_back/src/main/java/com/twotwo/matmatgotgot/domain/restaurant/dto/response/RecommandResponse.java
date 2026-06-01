package com.twotwo.matmatgotgot.domain.restaurant.dto.response;

import com.twotwo.matmatgotgot.domain.restaurant.entity.Recommand;
import lombok.Data;

import java.util.List;

@Data
public class RecommandResponse {

    List<Recommand> popular;
    List<Recommand> like;
    List<Recommand> region;
}
