package com.ribbony.ribbony.Modules.OrderModule.dto;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class CreateOrderItemRequest {
 
    @NotNull(message = "productId is required")
    private Integer productId; 

    @NotNull(message = "quantity is required")
    @Positive(message = "quantity must be positive")
    private Integer quantity;

    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode payload;
}
