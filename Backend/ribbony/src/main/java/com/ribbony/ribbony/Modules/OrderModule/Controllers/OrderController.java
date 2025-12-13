package com.ribbony.ribbony.Modules.OrderModule.Controllers;

import java.util.List;
import java.util.Map; // Added Import

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.ribbony.ribbony.Modules.OrderModule.Services.OrderService;
import com.ribbony.ribbony.Modules.OrderModule.dto.CreateOrderRequest;
import com.ribbony.ribbony.Modules.OrderModule.dto.OrderResponse;
import com.ribbony.ribbony.Modules.OrderModule.dto.UpdateOrderStatusRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderServiceObj;

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PostMapping("/create")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        OrderResponse created = orderServiceObj.createOrder(request, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasAnyRole('USER')")
    @GetMapping("/getUserOrders")
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<OrderResponse> orders = orderServiceObj.getOrdersForUser(userDetails);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/getOrderDetails/{id}")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<OrderResponse> getOrderDetails(
            @PathVariable int id,
            @AuthenticationPrincipal UserDetails userDetails) {

        OrderResponse response = orderServiceObj.getOrderForUserById(id, userDetails);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAllOrders")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> all = orderServiceObj.getAllOrders();
        return ResponseEntity.ok(all);
    }

    @GetMapping("/getOrderDetailsByID/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<OrderResponse> getOrderDetailsByID(
            @PathVariable("id") Integer id) {

        OrderResponse resp = orderServiceObj.getOrderByIdAdmin(id);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("updateStatus/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable("id") Integer id,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            @AuthenticationPrincipal UserDetails adminUser) {

        OrderResponse updated = orderServiceObj.updateOrderStatus(id, request, adminUser);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/cancel")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<?> cancelOrderByUser(
            @RequestParam("id") Integer orderId,
            @AuthenticationPrincipal UserDetails userDetails) {

        orderServiceObj.cancelOrderByUser(orderId, userDetails);
        
        // FIX: Return valid JSON object instead of a string
        return ResponseEntity.ok(Map.of("message", "Order cancelled successfully"));
    }

    @PutMapping("/admin/cancel")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> cancelOrderByAdmin(
            @RequestParam("id") Integer orderId,
            @AuthenticationPrincipal UserDetails adminUser) {

        orderServiceObj.cancelOrderByAdmin(orderId, adminUser);
        
        // FIX: Return valid JSON object instead of a string
        return ResponseEntity.ok(Map.of("message", "Order cancelled by admin"));
    }
}