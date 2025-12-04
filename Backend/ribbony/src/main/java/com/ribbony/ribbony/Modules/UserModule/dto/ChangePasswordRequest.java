package com.ribbony.ribbony.Modules.UserModule.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    private int id;
    private String newPassword;
}
