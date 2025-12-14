package com.ribbony.ribbony.Modules.AuthModule.security;

import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import com.ribbony.ribbony.Modules.AuthModule.Service.JwtService;

@Component
public class DefaultJwtValidationStrategy implements JwtValidationStrategy {

    private final JwtService jwtService;

    public DefaultJwtValidationStrategy(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Claims extractAllClaims(String token) {
        return jwtService.extractAllClaims(token);
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        return jwtService.validateToken(token, userDetails);
    }

    @Override
    public boolean isTokenExpired(String token) {
        return jwtService.isTokenExpired(token);
    }

    @Override
    public String refreshToken(String token) {
        return jwtService.refreshToken(token);
    }
}
