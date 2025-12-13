package com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.access.AccessDeniedException;

import lombok.extern.slf4j.Slf4j;

/**
 * Centralized exception handler for the application.
 * - Handles validation errors, custom API exceptions (BadRequest/NotFound),
 *   security authorization errors (403) and generic server errors (500).
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ----------------- BadRequestException -----------------
    @ExceptionHandler(BadRequestException.class)
    @ResponseBody
    public ResponseEntity<Object> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
        log.warn("[GlobalExceptionHandler] BadRequest -> uri={} message={}", request.getRequestURI(), ex.getMessage());

        Map<String, Object> body = new HashMap<>();
        body.put("title", ex.getMessage());
        if (ex.getErrors() != null) body.put("errors", ex.getErrors());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // ----------------- NotFoundException -----------------
    @ExceptionHandler(NotFoundException.class)
    @ResponseBody
    public ResponseEntity<Object> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        log.warn("[GlobalExceptionHandler] NotFound -> uri={} message={}", request.getRequestURI(), ex.getMessage());

        Map<String, Object> body = new HashMap<>();
        body.put("title", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // ----------------- Validation errors -----------------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String[]> failures =
                ex.getBindingResult()
                  .getFieldErrors()
                  .stream()
                  .collect(Collectors.groupingBy(
                          FieldError::getField,
                          Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())
                  ))
                  .entrySet()
                  .stream()
                  .collect(Collectors.toMap(
                      Map.Entry::getKey,
                      e -> e.getValue().toArray(new String[0])
                  ));

        log.info("[GlobalExceptionHandler] Validation failed -> uri={} fields={}", request.getRequestURI(), failures.keySet());

        Map<String, Object> body = new HashMap<>();
        body.put("title", "Validation failed");
        body.put("errors", failures);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // ----------------- Authorization (Method security) -----------------
    @ExceptionHandler(AuthorizationDeniedException.class)
    @ResponseBody
    public ResponseEntity<Object> handleAuthorizationDenied(AuthorizationDeniedException ex, HttpServletRequest request) {
        log.warn("[GlobalExceptionHandler] Authorization denied -> uri={} message={}", request.getRequestURI(), ex.getMessage());

        Map<String, Object> body = new HashMap<>();
        body.put("title", "Forbidden");
        body.put("message", "Access is denied");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // ----------------- AccessDenied (filter-level) -----------------
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseBody
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        log.warn("[GlobalExceptionHandler] Access denied -> uri={} message={}", request.getRequestURI(), ex.getMessage());

        Map<String, Object> body = new HashMap<>();
        body.put("title", "Forbidden");
        body.put("message", "Access is denied");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // ----------------- Generic fallback -----------------
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<Object> handleGenericException(Exception ex, HttpServletRequest request) {
        // Log stacktrace for debugging (avoid leaking sensitive info to client)
        log.error("[GlobalExceptionHandler] Unhandled Exception at uri=" + request.getRequestURI(), ex);

        Map<String, Object> body = new HashMap<>();
        body.put("title", "Internal Server Error");
        // In production you might want to hide ex.getMessage() — for dev it's useful.
        body.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
