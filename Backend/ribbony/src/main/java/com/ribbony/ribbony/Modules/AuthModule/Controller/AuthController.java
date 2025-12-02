package com.ribbony.ribbony.Modules.AuthModule.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RestController;
import com.ribbony.ribbony.Modules.AuthModule.Service.AuthService;
import com.ribbony.ribbony.Modules.AuthModule.dto.LoginRequest;
import com.ribbony.ribbony.Modules.AuthModule.dto.RegisterRequest;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RequestMapping("/auth")
@RestController
public class AuthController {

    @Autowired
    private AuthService authServiceObj;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult result) {

        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        return ResponseEntity.ok(authServiceObj.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, BindingResult result) {

        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        return ResponseEntity.ok(authServiceObj.login(request));
    }
}
