package com.ribbony.ribbony.Modules.UserModule.dto;

import lombok.Data;

@Data
public class ChangeEmailRequest {

    private int id;
    private String newEmail;
}
