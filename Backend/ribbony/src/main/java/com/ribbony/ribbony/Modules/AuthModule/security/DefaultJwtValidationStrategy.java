package com.ribbony.ribbony.Modules.AuthModule.security;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;
import com.ribbony.ribbony.Modules.AuthModule.Service.JwtService;


@Component("defaultJwtValidationStrategy")
public class DefaultJwtValidationStrategy implements JwtValidationStrategy {

    private final JwtService originalJwtService;

    public DefaultJwtValidationStrategy(@Qualifier("jwtService") JwtService originalJwtService) {
        this.originalJwtService = originalJwtService;
    }

    @Override
    public Claims extractAllClaims(String token) {
        return originalJwtService.extractAllClaims(token);
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        return originalJwtService.validateToken(token, userDetails);
    }

    @Override
    public boolean isTokenExpired(String token) {
        return originalJwtService.isTokenExpired(token);
    }

    @Override
    public String refreshToken(String token) {
        return originalJwtService.refreshToken(token);
    }
}
