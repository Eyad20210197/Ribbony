package com.ribbony.ribbony.Modules.ProductModule.dto;

import lombok.Data;
import jakarta.validation.constraints.Pattern;

@Data
public class UpdateProductRequest {
    private Integer id;

    private String name;
    private String price;

    private String description;
    private String category;
    private String productImagesJson;
}
