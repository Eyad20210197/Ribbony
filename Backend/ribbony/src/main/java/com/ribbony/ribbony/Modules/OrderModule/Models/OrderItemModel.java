package com.ribbony.ribbony.Modules.OrderModule.Models;
import com.fasterxml.jackson.databind.JsonNode;
import com.ribbony.ribbony.Modules.ProductModule.Models.ProductModel;

import java.math.BigDecimal;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemModel extends com.ribbony.ribbony.Modules.SharedInfrastructureModule.Base.BaseEntity {

    @NotNull
    @Positive
    @Column(name = "price_at_time", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtTime;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private OrderModel order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private ProductModel product;
    
    @NotNull
    @Positive
    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name ="payload" , columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode payload;

}
