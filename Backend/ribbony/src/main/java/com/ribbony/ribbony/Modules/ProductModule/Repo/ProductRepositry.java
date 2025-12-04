package com.ribbony.ribbony.Modules.ProductModule.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ribbony.ribbony.Modules.ProductModule.Models.ProductModel;

public interface ProductRepositry extends JpaRepository<ProductModel, Integer> {
}
