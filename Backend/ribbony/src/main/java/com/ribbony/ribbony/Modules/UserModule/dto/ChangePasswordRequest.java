package com.ribbony.ribbony.Modules.UserModule.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @Min(value = 1, message = "id must be a positive integer")
    private int id;

    @NotBlank(message = "newPassword is required")
    @Size(min = 6, message = "newPassword must be at least 6 characters")
    private String newPassword;
}
