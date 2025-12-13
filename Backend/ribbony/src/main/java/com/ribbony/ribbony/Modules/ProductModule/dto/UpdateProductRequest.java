package com.ribbony.ribbony.Modules.ProductModule.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class UpdateProductRequest {
    private Integer id;

    private String name;

    @PositiveOrZero(message = "price must be zero or positive")
    private BigDecimal price;

    private String description;

    private String category;

    private String productImage;
}
