package com.twotwo.exception;

import com.twotwo.exception.BusinessException;
import com.twotwo.exception.ErrorCode;

public class MemberNotFoundException extends BusinessException {
    public MemberNotFoundException() {
        super(ErrorCode.MEMBER_NOT_FOUND);
    }
}
