package com.ribbony.ribbony.Modules.AuthModule.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.BadRequestException;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate token with full UserModel (includes role claim).
     */
    public String generateToken(UserModel user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(user.getUserEmail())
                .claim("role", user.getUserRole() != null ? user.getUserRole().name() : null)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Minimal overload: generate token given only email (no role).
     * Needed so refreshToken can create a new token from subject.
     */
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Parse claims. If token is expired, return the claims from the ExpiredJwtException
     * so refreshToken can extract the subject. For other problems, throw BadRequestException.
     */
    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException ex) {
            // Token expired — return claims so caller can use subject if needed
            return ex.getClaims();
        } catch (JwtException | IllegalArgumentException ex) {
            // Malformed / invalid token
            throw new BadRequestException("Invalid token: " + ex.getMessage());
        }
    }

    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (BadRequestException ex) {
            // invalid token -> not valid
            return false;
        } catch (Exception ex) {
            // any other parsing issue -> not valid
            return false;
        }
    }

    /**
     * Safe check for expiration: returns true if token is expired or invalid.
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = extractAllClaims(token).getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException ex) {
            // expired
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            // invalid -> treat as expired/invalid
            return true;
        } catch (Exception ex) {
            // fallback: consider invalid/expired
            return true;
        }
    }

    /**
     * Refresh token logic (kept minimal & aligned with original behavior):
     * - If token is expired -> extract subject and generate a new token using generateToken(String).
     * - If token is still valid -> throw BadRequestException.
     * - If token invalid -> BadRequestException thrown by extractAllClaims.
     */
    public String refreshToken(String token) {
        // If token not expired -> cannot refresh
        if (!isTokenExpired(token)) {
            throw new BadRequestException("Token is still valid");
        }

        // At this point token is expired or invalid; extract subject (extractAllClaims returns claims even for expired tokens)
        Claims claims = extractAllClaims(token);
        String subject = claims != null ? claims.getSubject() : null;

        if (subject == null || subject.isBlank()) {
            throw new BadRequestException("Cannot refresh token: subject not present");
        }

        // generate token using email/subject (no role info)
        return generateToken(subject);
    }
}
