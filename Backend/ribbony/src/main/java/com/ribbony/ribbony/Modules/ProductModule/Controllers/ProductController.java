package com.ribbony.ribbony.Modules.ProductModule.Controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.ribbony.ribbony.Modules.ProductModule.Services.ProductService;
import com.ribbony.ribbony.Modules.ProductModule.dto.CreateProductRequest;
import com.ribbony.ribbony.Modules.ProductModule.dto.UpdateProductRequest;
import com.ribbony.ribbony.Modules.ProductModule.dto.ProductResponse;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productServiceObj;

    @GetMapping("/list")
    public ResponseEntity<List<ProductResponse>> listProducts() {
        List<ProductResponse> list = productServiceObj.listProducts()
                .stream()
                .map(productServiceObj::buildProductResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/getproduct/{id}")
    public ResponseEntity<?> getProduct(@PathVariable int id) {
        return ResponseEntity.ok(productServiceObj.buildProductResponse(productServiceObj.getProduct(id)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<?> addProduct(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productServiceObj.addProduct(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable int id, @Valid @RequestBody UpdateProductRequest request) {
        request.setId(id);
        return ResponseEntity.ok(productServiceObj.updateProduct(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        return ResponseEntity.ok(productServiceObj.deleteProduct(id));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map((FieldError e) -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
