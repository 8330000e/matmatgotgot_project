package com.twotwo.matmatgotgot.domain.restaurant.dto.request;

import lombok.Data;

@Data
public class ReportRequest {

    private String memberId;
    private String type;
    private Long no;
    private String reason;
    private String detail;
}
