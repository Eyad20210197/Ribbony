package com.ribbony.ribbony.Modules.AuthModule.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ribbony.ribbony.Modules.UserModule.Repo.UserRepositry;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestController
public class MeController {

    @Autowired
    private UserRepositry userRepositry;

    @GetMapping("/auth/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "unauthenticated"));
        }

        var userDetails = (UserDetails) authentication.getPrincipal();
        var email = userDetails.getUsername();

        var user = userRepositry.findByUserEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "user_not_found"));
        }

        var payload = Map.of(
           "id", user.getId(),
           "email", user.getUserEmail(),
           "firstName", user.getUserFirstName(),
           "lastName", user.getUserLastName(),
           "role", user.getUserRole().name()
        );
        return ResponseEntity.ok(payload);
    }
}
