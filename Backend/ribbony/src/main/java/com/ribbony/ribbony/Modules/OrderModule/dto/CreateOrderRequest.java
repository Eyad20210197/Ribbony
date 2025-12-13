package com.ribbony.ribbony.Modules.OrderModule.dto;

import java.util.List;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateOrderRequest {

    @NotNull(message = "orderItems is required")
    @Size(min = 1, message = "order must contain at least one item")
    private List<CreateOrderItemRequest> orderItems;

}
