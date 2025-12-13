package com.ribbony.ribbony.Modules.AuthModule.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.ribbony.ribbony.Modules.AuthModule.Service.AuthService;
import com.ribbony.ribbony.Modules.AuthModule.dto.LoginRequest;
import com.ribbony.ribbony.Modules.AuthModule.dto.RegisterRequest;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;

@RequestMapping("/auth")
@RestController
public class AuthController {

    @Autowired
    private AuthService authServiceObj;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authServiceObj.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authServiceObj.login(request));
    }
}
