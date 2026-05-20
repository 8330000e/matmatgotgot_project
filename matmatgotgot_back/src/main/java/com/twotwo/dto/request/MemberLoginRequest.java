package com.twotwo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MemberLoginRequest {
    @NotBlank
    private String memberId;

    @NotBlank
    private String memberPw;
}
