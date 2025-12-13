package com.ribbony.ribbony.Modules.UserModule.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Min(value = 1, message = "id must be a positive integer")
    private int id;

    @Size(min = 1, message = "firstName cannot be empty")
    private String firstName;

    @Size(min = 1, message = "lastName cannot be empty")
    private String lastName;

    private String address;

    private String role;
}
