package com.ribbony.ribbony.Modules.AuthModule.security;

import io.jsonwebtoken.Claims;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.Map;


@Service
@Primary
public class DelegatingJwtService extends com.ribbony.ribbony.Modules.AuthModule.Service.JwtService {

    private final Map<String, JwtValidationStrategy> strategies;
    private final JwtValidationStrategy defaultStrategy;
    private final com.ribbony.ribbony.Modules.AuthModule.Service.JwtService originalJwtService;

    public DelegatingJwtService(Map<String, JwtValidationStrategy> strategies,
                                @Qualifier("jwtService") com.ribbony.ribbony.Modules.AuthModule.Service.JwtService originalJwtService) {
        this.strategies = strategies;
        this.originalJwtService = originalJwtService;

        if (strategies.containsKey("defaultJwtValidationStrategy")) {
            this.defaultStrategy = strategies.get("defaultJwtValidationStrategy");
        } else if (!strategies.isEmpty()) {
            this.defaultStrategy = strategies.values().iterator().next();
        } else {
            throw new IllegalStateException("No JwtValidationStrategy beans found. Add at least one strategy (e.g., defaultJwtValidationStrategy).");
        }
    }

   
    protected JwtValidationStrategy chooseStrategy(String token) {
        return defaultStrategy;
    }

    @Override
    public Claims extractAllClaims(String token) {
        return chooseStrategy(token).extractAllClaims(token);
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        return chooseStrategy(token).validateToken(token, userDetails);
    }

    @Override
    public boolean isTokenExpired(String token) {
        return chooseStrategy(token).isTokenExpired(token);
    }

    @Override
    public String refreshToken(String token) {
        return chooseStrategy(token).refreshToken(token);
    }

    @Override
    public String generateToken(com.ribbony.ribbony.Modules.UserModule.Models.UserModel user) {
        return originalJwtService.generateToken(user);
    }

    @Override
    public String generateToken(String email) {
        return originalJwtService.generateToken(email);
    }
}
