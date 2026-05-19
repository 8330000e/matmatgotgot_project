package com.twotwo.matmatgotgot.member.exception;

import com.twotwo.global.exception.BusinessException;
import com.twotwo.global.exception.ErrorCode;

public class UserNotFoundException extends BusinessException {
    public UserNotFoundException() {
        super(ErrorCode.MEMBER_NOT_FOUND);
    }
}
