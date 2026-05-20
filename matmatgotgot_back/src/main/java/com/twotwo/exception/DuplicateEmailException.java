package com.twotwo.exception;

import com.twotwo.exception.BusinessException;
import com.twotwo.exception.ErrorCode;

public class DuplicateEmailException extends BusinessException {
    public DuplicateEmailException() {
        super(ErrorCode.DUPLICATE_EMAIL);
    }
}
