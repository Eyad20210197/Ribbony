package com.ribbony.ribbony.Modules.ProductModule.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ProductResponse {
    private int id;
    private String name;
    private  BigDecimal price;
    private String description;
    private String category;
    private String productImage;
}
