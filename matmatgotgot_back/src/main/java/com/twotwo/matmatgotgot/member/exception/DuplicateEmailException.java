package com.twotwo.matmatgotgot.member.exception;

import com.twotwo.global.exception.BusinessException;
import com.twotwo.global.exception.ErrorCode;

public class DuplicateEmailException extends BusinessException {
    public DuplicateEmailException() {
        super(ErrorCode.DUPLICATE_EMAIL);
    }
}
