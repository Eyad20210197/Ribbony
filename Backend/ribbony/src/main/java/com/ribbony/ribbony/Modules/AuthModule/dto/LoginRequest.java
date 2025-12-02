package com.ribbony.ribbony.Modules.AuthModule.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
