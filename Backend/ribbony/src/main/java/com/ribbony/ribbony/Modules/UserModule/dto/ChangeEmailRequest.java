package com.ribbony.ribbony.Modules.UserModule.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangeEmailRequest {

    @Min(value = 1, message = "id must be a positive integer")
    private int id;

    @NotBlank(message = "newEmail is required")
    @Email(message = "invalid email format")
    private String newEmail;
}
