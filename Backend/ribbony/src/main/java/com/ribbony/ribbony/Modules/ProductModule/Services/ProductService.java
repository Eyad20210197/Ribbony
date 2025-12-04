package com.ribbony.ribbony.Modules.ProductModule.Services;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ribbony.ribbony.Modules.ProductModule.Models.ProductModel;
import com.ribbony.ribbony.Modules.ProductModule.Repo.ProductRepositry;
import com.ribbony.ribbony.Modules.ProductModule.dto.CreateProductRequest;
import com.ribbony.ribbony.Modules.ProductModule.dto.UpdateProductRequest;
import com.ribbony.ribbony.Modules.ProductModule.dto.ProductResponse;

@Service
public class ProductService {

    @Autowired
    private ProductRepositry productRepositryObj;

    public List<ProductModel> listProducts() {
        return productRepositryObj.findAll();
    }

    public ProductModel getProduct(int id) {
        Optional<ProductModel> optional = productRepositryObj.findById(id);
        return optional.orElseThrow(() -> new NoSuchElementException("Product not found with id: " + id));
    }

    public ProductResponse addProduct(CreateProductRequest request) {
        ProductModel p = new ProductModel();
        p.setProductName(request.getName().trim());
        p.setPrice(new BigDecimal(request.getPrice()));
        p.setDescription(request.getDescription());
        p.setCategory(request.getCategory());
        p.setProductImages(request.getProductImagesJson());

        ProductModel saved = productRepositryObj.save(p);
        return buildProductResponse(saved);
    }

    public ProductResponse updateProduct(UpdateProductRequest request) {
        ProductModel product = getProduct(request.getId());

        if (request.getName() != null) product.setProductName(request.getName().trim());
        if (request.getPrice() != null) product.setPrice(new BigDecimal(request.getPrice()));
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getProductImagesJson() != null) product.setProductImages(request.getProductImagesJson());

        ProductModel updated = productRepositryObj.save(product);
        return buildProductResponse(updated);
    }

    public String deleteProduct(int id) {
        if (!productRepositryObj.existsById(id)) {
            throw new NoSuchElementException("Product not found with id: " + id);
        }
        productRepositryObj.deleteById(id);
        return "Product deleted with id: " + id;
    }

    public ProductResponse buildProductResponse(ProductModel p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getProductName());
        r.setPrice(p.getPrice().toPlainString());
        r.setDescription(p.getDescription());
        r.setCategory(p.getCategory());
        r.setProductImagesJson(p.getProductImages());
        return r;
    }
}
