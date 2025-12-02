package com.ribbony.ribbony.Modules.OrderModule.Models;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.Base.BaseEntity;
import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.*;
@Entity
@Table(name = "orders")
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderModel extends BaseEntity{ 

    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus OrderStatus; 

    @OneToMany(mappedBy = "order")
    private java.util.List<OrderItemModel> orderItems;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @NotNull
    @Positive
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
   
}
