package com.ribbony.ribbony.Modules.AuthModule.security;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtValidationStrategy {

    Claims extractAllClaims(String token);

    boolean validateToken(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);

    String refreshToken(String token);
}
