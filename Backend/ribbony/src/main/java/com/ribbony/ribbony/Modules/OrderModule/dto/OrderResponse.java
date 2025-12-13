package com.ribbony.ribbony.Modules.OrderModule.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderResponse {
    
    private Integer id;
    private String status;
    private Integer userId;
    private List<OrderItemResponse> orderItems;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
