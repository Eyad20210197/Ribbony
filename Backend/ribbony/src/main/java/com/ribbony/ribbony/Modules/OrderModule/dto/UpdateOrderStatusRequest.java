package com.ribbony.ribbony.Modules.OrderModule.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
 
    @NotNull(message = "status is required")
    private String status;

}
