package com.twotwo.matmatgotgot.domain.restaurant.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ReviewCreateRequest {

    private Long reviewNo;
    private Long memberNo;
    private Long restNo;
    private String restName;
    private String restAddr;
    private String reviewVisit;
    private String reviewContent;
    private int rating;

    private String reviewMenu;
    private List<String> tags;
    private List<MultipartFile> files;
}