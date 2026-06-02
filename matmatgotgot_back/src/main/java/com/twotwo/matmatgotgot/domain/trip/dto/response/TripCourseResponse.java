package com.twotwo.matmatgotgot.domain.trip.dto.response;

import lombok.*;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias(value="tripCourseResponse")
public class TripCourseResponse {
    private Long memberNo;
    private Long tplanNo;
    private String title;
    private String desc;
    private Integer tplanDays;
    private Integer tplanLike;
    private Integer tplanView;
    private String imgName;
}