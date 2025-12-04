package com.ribbony.ribbony.Modules.ProductModule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateProductRequest {

    private String name;
    private String price;
    private String description;
    private String category;
    private String productImagesJson;
}
