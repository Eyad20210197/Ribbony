package com.ribbony.ribbony.Modules.UserModule.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    
    private int id;
    private String firstName;
    private String lastName;
    private String address;
    private String role;
}
