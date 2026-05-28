package com.twotwo.global.exception;

import com.twotwo.global.exception.BusinessException;
import com.twotwo.global.exception.ErrorCode;

public class MemberNotFoundException extends BusinessException {
    public MemberNotFoundException() {
        super(ErrorCode.MEMBER_NOT_FOUND);
    }
}
