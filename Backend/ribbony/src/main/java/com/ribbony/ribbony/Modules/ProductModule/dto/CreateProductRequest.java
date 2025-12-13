package com.ribbony.ribbony.Modules.ProductModule.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class CreateProductRequest {

    @NotBlank(message = "name is required")
    private String name;

    @NotNull(message = "price is required")
    @PositiveOrZero(message = "price must be zero or positive")
    private BigDecimal price;

    private String description;

    @NotBlank(message = "category is required")
    private String category;

    // optional: single image url/string
    private String productImage;
}
