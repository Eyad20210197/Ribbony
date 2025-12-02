package com.ribbony.ribbony.Modules.AuthModule.dto;
import lombok.Data;

@Data
public class AuthResponse {
   
    private String token;
    private int id;
    private String role;
}
