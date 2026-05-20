package com.twotwo.exception;

import com.twotwo.exception.BusinessException;
import com.twotwo.exception.ErrorCode;

public class UserNotFoundException extends BusinessException {
    public UserNotFoundException() {
        super(ErrorCode.MEMBER_NOT_FOUND);
    }
}
