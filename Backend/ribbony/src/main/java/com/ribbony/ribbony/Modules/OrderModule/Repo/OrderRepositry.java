package com.ribbony.ribbony.Modules.OrderModule.Repo;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ribbony.ribbony.Modules.OrderModule.Models.OrderModel;
import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;
public interface OrderRepositry extends JpaRepository<OrderModel, Integer> {
    
    List<OrderModel> findByUser(UserModel user);

   // OrderRepositry.java
Optional<OrderModel> findByIdAndUser(Integer id, UserModel user);

     
}

