package com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception;

public class ApiException extends RuntimeException {

    private final int status;
    private final Object errors;

    public ApiException(String message, int status) {
        this(message, status, null);
    }

    public ApiException(String message, int status, Object errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    public int getStatus() {
        return status;
    }

    public Object getErrors() {
        return errors;
    }
}