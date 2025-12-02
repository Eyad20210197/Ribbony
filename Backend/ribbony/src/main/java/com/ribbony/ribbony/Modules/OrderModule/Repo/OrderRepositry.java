package com.ribbony.ribbony.Modules.OrderModule.Repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ribbony.ribbony.Modules.OrderModule.Models.OrderModel;
public interface OrderRepositry extends JpaRepository<OrderModel, Integer> {
    
}
