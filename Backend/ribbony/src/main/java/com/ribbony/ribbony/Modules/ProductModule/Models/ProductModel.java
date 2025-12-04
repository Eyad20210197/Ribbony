package com.ribbony.ribbony.Modules.ProductModule.Models;

import java.math.BigDecimal;

import com.ribbony.ribbony.Modules.SharedInfrastructureModule.Base.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.persistence.Column;
import lombok.*;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductModel extends BaseEntity {

   @NotBlank
   @Column(name = "product_name", nullable = false, length = 100)
   private String productName;

   @NotNull
   @Positive
   @Column(name = "product_price", nullable = false, precision = 10, scale = 2)
   private BigDecimal price;

   @Column(name = "description", length = 300)
   private String description;

   @Column(name = "category", length = 100)
   private String category;

   @Column(name = "product_images", columnDefinition = "jsonb")
   private String productImages;
}
