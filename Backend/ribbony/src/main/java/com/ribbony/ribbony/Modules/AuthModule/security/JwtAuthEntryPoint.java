// src/main/java/com/ribbony/ribbony/Modules/AuthModule/security/JwtAuthEntryPoint.java
package com.ribbony.ribbony.Modules.AuthModule.security;

import java.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        // Mask token if present and log the unauthorized attempt
        String authHeader = request.getHeader("Authorization");
        String masked = maskHeaderToken(authHeader);

        log.warn("[JwtAuthEntryPoint] commence -> uri={} remoteAddr={} message={} token(masked)={}",
                request.getRequestURI(),
                request.getRemoteAddr(),
                authException == null ? "unauthorized" : authException.getMessage(),
                masked);

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Unauthorized or invalid token\"}");
    }

    private String maskHeaderToken(String authHeader) {
        if (authHeader == null) return "none";
        try {
            if (authHeader.toLowerCase().startsWith("bearer ")) {
                String token = authHeader.substring(7).trim();
                return maskToken(token);
            } else {
                return maskToken(authHeader);
            }
        } catch (Exception e) {
            return "none";
        }
    }

    private String maskToken(String token) {
        if (token == null) return "none";
        int len = token.length();
        if (len <= 20) return "****";
        int p = 10, s = 10;
        if (len <= p + s) return "****";
        return token.substring(0, p) + "...." + token.substring(len - s);
    }
}
