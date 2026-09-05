package com.twotwo.matmatgotgot.domain.board.entity;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("review")
public class review {
    private Integer reviewNo;
    private String memberId;
    private Integer restNo;
    private String reviewContent;
    private Integer rating;
    private Date visitDate;
    private Integer isLocalReview;
    private Integer reviewStatus;
    private Date createdAt;
    private String restName;

    private Integer reviewComRpNo;
    private Integer commentNo;
    private String reason;
    private Integer reportStatus;

    private Integer parentComment;
    private Integer depth;
    private String content;
    private Integer comStatus;

    private Integer reviewImageNo;
    private String imageUrl;

    private Integer reviewMenuNo;
    private String menuName;

    private Integer reviewRpNo;
    private String detail;

    private Integer reviewTagsNo;
    private String tagName;
}
