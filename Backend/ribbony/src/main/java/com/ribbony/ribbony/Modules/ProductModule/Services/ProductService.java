package com.ribbony.ribbony.Modules.ProductModule.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ribbony.ribbony.Modules.ProductModule.Models.ProductModel;
import com.ribbony.ribbony.Modules.ProductModule.Repo.ProductRepositry;
import com.ribbony.ribbony.Modules.ProductModule.dto.CreateProductRequest;
import com.ribbony.ribbony.Modules.ProductModule.dto.UpdateProductRequest;
import com.ribbony.ribbony.Modules.ProductModule.dto.ProductResponse;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.BadRequestException;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.NotFoundException;

@Service
public class ProductService {

    @Autowired
    private ProductRepositry productRepositryObj;

    /* ---------------- Get All Products ---------------- */
    public List<ProductModel> listProducts() {
        return productRepositryObj.findAll();
    }

    /* ---------------- Get Product by ID ---------------- */
    public ProductModel getProduct(int id) {
        Optional<ProductModel> optional = productRepositryObj.findById(id);
        return optional.orElseThrow(() -> new NotFoundException("Product not found with id: " + id));
    }

    /* ---------------- Add Product ---------------- */
    public ProductResponse addProduct(CreateProductRequest request) {

        String name = request.getName() != null ? request.getName().trim() : null;
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Product name is required");
        }

        if (productRepositryObj.existsByProductName(name)) {
            throw new BadRequestException("Product already exists with name: " + name);
        }

        ProductModel p = new ProductModel();
        p.setProductName(name);
        p.setPrice(request.getPrice());
        p.setDescription(request.getDescription());
        p.setCategory(request.getCategory());

        // one image string
        p.setProductImages(request.getProductImage());

        ProductModel saved = productRepositryObj.save(p);
        return buildProductResponse(saved);
    }

    /* ---------------- Update Product ---------------- */
    public ProductResponse updateProduct(UpdateProductRequest request) {

        if (request.getId() == null) {
            throw new BadRequestException("Product id is required for update");
        }

        ProductModel p = getProduct(request.getId());

        if (request.getName() != null) {
            p.setProductName(request.getName().trim());
        }

        if (request.getPrice() != null) {
            p.setPrice(request.getPrice());
        }

        if (request.getDescription() != null) {
            p.setDescription(request.getDescription());
        }

        if (request.getCategory() != null) {
            p.setCategory(request.getCategory());
        }

        // single image string
        if (request.getProductImage() != null) {
            p.setProductImages(request.getProductImage());
        }

        ProductModel saved = productRepositryObj.save(p);

        return buildProductResponse(saved);
    }

    /* ---------------- Delete Product ---------------- */
    public String deleteProduct(int id) {
        if (!productRepositryObj.existsById(id)) {
            throw new NotFoundException("Product not found with id: " + id);
        }
        productRepositryObj.deleteById(id);
        return "Product deleted with id: " + id;
    }

    /* ---------------- Build Response ---------------- */
    public ProductResponse buildProductResponse(ProductModel p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getProductName());
        r.setPrice(p.getPrice());
        r.setDescription(p.getDescription());
        r.setCategory(p.getCategory());

        // single image string
        r.setProductImage(p.getProductImages());

        return r;
    }
}
