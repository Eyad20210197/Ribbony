package com.ribbony.ribbony.Modules.OrderModule.Repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ribbony.ribbony.Modules.OrderModule.Models.OrderItemModel;
public interface OrderItemRepositry extends JpaRepository<OrderItemModel, Integer> {
    
}
