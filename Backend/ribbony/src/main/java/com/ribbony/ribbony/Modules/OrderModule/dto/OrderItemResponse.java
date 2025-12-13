package com.ribbony.ribbony.Modules.OrderModule.dto;

import java.math.BigDecimal;


import com.fasterxml.jackson.databind.JsonNode;

import lombok.Data;

@Data
public class OrderItemResponse {

    private Integer id;
    private Integer productId;
    private String productName; 
    private BigDecimal priceAtTime;
    private Integer quantity;
    private JsonNode payload;
}
