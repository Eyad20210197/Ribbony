// src/main/java/com/ribbony/ribbony/Modules/AuthModule/security/JwtAuthFilter.java
package com.ribbony.ribbony.Modules.AuthModule.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ribbony.ribbony.Modules.AuthModule.Service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtServiceObj;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtServiceObj, UserDetailsService userDetailsService) {
        this.jwtServiceObj = jwtServiceObj;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // quick trace log (INFO) to confirm filter runs
        log.debug("[JwtAuthFilter] enter doFilterInternal -> uri={} authHeaderPresent={}",
                request.getRequestURI(), authHeader != null);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = jwtServiceObj.extractAllClaims(token);
            String email = claims.getSubject();
            String roleClaim = claims.get("role", String.class);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (jwtServiceObj.validateToken(token, userDetails)) {
                    Collection<? extends GrantedAuthority> authorities;
                    if (roleClaim != null && !roleClaim.isBlank()) {
                        String roleClean = roleClaim.startsWith("ROLE_") ? roleClaim.substring(5) : roleClaim;
                        SimpleGrantedAuthority auth = new SimpleGrantedAuthority("ROLE_" + roleClean);
                        List<GrantedAuthority> list = new ArrayList<>();
                        list.add(auth);
                        authorities = list;
                    } else {
                        authorities = userDetails.getAuthorities();
                    }

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    authorities
                            );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // safe info log (no token)
                    log.info("[JwtAuthFilter] Authenticated principal='{}' authorities={}",
                            userDetails.getUsername(), authorities);
                } else {
                    // validation failed -> log masked token & return 401
                    logTokenOnFailure("validation failed", token, email, request.getRequestURI(), request.getRemoteAddr());
                    sendUnauthorized(response, "Unauthorized or invalid token (validation failed)");
                    return;
                }
            }

        } catch (ExpiredJwtException ex) {
            String subj = null;
            try { subj = ex.getClaims() != null ? ex.getClaims().getSubject() : null; } catch (Exception ignored) {}
            logTokenOnFailure("token expired: " + ex.getMessage(), token, subj, request.getRequestURI(), request.getRemoteAddr());
            sendUnauthorized(response, "Token expired");
            return;
        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException ex) {
            logTokenOnFailure("invalid token format: " + ex.getMessage(), token, null, request.getRequestURI(), request.getRemoteAddr());
            sendUnauthorized(response, "Invalid token format");
            return;
        } catch (UsernameNotFoundException ex) {
            logTokenOnFailure("user not found for token: " + ex.getMessage(), token, null, request.getRequestURI(), request.getRemoteAddr());
            sendUnauthorized(response, "User not found for token");
            return;
        } catch (Exception ex) {
            log.error("[JwtAuthFilter] Unexpected error while processing token", ex);
            logTokenOnFailure("unexpected error: " + ex.getMessage(), token, null, request.getRequestURI(), request.getRemoteAddr());
            sendUnauthorized(response, "Unauthorized or invalid token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    // --- helpers ---

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"" + message.replace("\"", "") + "\"}");
    }

    private void logTokenOnFailure(String reason, String token, String subject, String uri, String remoteAddr) {
        String masked = maskTokenPreview(token);
        if (subject == null) subject = "unknown";
        log.warn("[JwtAuthFilter] Reject uri='{}' remoteAddr='{}' subject='{}' reason='{}' token(masked)={}",
                uri, remoteAddr, subject, reason, masked);
    }

    private String maskTokenPreview(String token) {
        if (token == null) return "none";
        token = token.trim();
        if (token.length() < 20) return "****";
        int p = 10, s = 10;
        if (token.length() <= p + s) return "****";
        return token.substring(0, p) + "...." + token.substring(token.length() - s);
    }
}
