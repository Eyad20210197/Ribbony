package com.ribbony.ribbony.Modules.AuthModule.security;

import io.jsonwebtoken.Claims;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

import com.ribbony.ribbony.Modules.AuthModule.Service.JwtService;

@Service
@Primary
public class DelegatingJwtService {

    private final Map<String, JwtValidationStrategy> strategies;
    private final JwtValidationStrategy defaultStrategy;
    private final JwtService jwtService;

    public DelegatingJwtService(
            Map<String, JwtValidationStrategy> strategies,
            JwtService jwtService
    ) {
        this.strategies = strategies;
        this.jwtService = jwtService;

        if (strategies.containsKey("defaultJwtValidationStrategy")) {
            this.defaultStrategy = strategies.get("defaultJwtValidationStrategy");
        } else if (!strategies.isEmpty()) {
            this.defaultStrategy = strategies.values().iterator().next();
        } else {
            throw new IllegalStateException(
                "No JwtValidationStrategy beans found. Add at least one strategy."
            );
        }
    }

    protected JwtValidationStrategy chooseStrategy(String token) {
        return defaultStrategy;
    }

    public Claims extractAllClaims(String token) {
        return chooseStrategy(token).extractAllClaims(token);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        return chooseStrategy(token).validateToken(token, userDetails);
    }

    public boolean isTokenExpired(String token) {
        return chooseStrategy(token).isTokenExpired(token);
    }

    public String refreshToken(String token) {
        return chooseStrategy(token).refreshToken(token);
    }

    public String generateToken(com.ribbony.ribbony.Modules.UserModule.Models.UserModel user) {
        return jwtService.generateToken(user);
    }

    public String generateToken(String email) {
        return jwtService.generateToken(email);
    }
}
