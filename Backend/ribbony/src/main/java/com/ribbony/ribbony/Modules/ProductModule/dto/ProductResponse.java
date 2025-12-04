package com.ribbony.ribbony.Modules.ProductModule.dto;

import lombok.Data;

@Data
public class ProductResponse {
    private Integer id;
    private String name;
    private String price;
    private String description;
    private String category;
    private String productImagesJson;
}
