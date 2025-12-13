package com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends ApiException {

    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST.value());
    }

    public BadRequestException(String message, Object errors) {
        super(message, HttpStatus.BAD_REQUEST.value(), errors);
    }
}