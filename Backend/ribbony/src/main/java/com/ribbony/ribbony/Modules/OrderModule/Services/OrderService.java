package com.ribbony.ribbony.Modules.OrderModule.Services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.ribbony.ribbony.Modules.OrderModule.Models.OrderItemModel;
import com.ribbony.ribbony.Modules.OrderModule.Models.OrderModel;
import com.ribbony.ribbony.Modules.OrderModule.Models.OrderStatus;
import com.ribbony.ribbony.Modules.OrderModule.Repo.OrderItemRepositry;
import com.ribbony.ribbony.Modules.OrderModule.Repo.OrderRepositry;
import com.ribbony.ribbony.Modules.OrderModule.dto.CreateOrderItemRequest;
import com.ribbony.ribbony.Modules.OrderModule.dto.CreateOrderRequest;
import com.ribbony.ribbony.Modules.OrderModule.dto.OrderResponse;
import com.ribbony.ribbony.Modules.OrderModule.dto.UpdateOrderStatusRequest;
import com.ribbony.ribbony.Modules.ProductModule.Models.ProductModel;
import com.ribbony.ribbony.Modules.ProductModule.Repo.ProductRepositry;
import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;
import com.ribbony.ribbony.Modules.UserModule.Repo.UserRepositry;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.BadRequestException;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.NotFoundException;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    OrderRepositry orderRepositryObj;

    @Autowired
    OrderItemRepositry orderItemRepositryObj;

    @Autowired
    ProductRepositry productRepositryObj;

    @Autowired
    private UserRepositry userRepositoryObj;

    public OrderResponse createOrder(CreateOrderRequest request, UserDetails userDetails) {

        String email = userDetails == null ? null : userDetails.getUsername();
        log.debug("createOrder called. jwt-subject/email = {}", email);

        if (email == null) {
            throw new BadRequestException("Authenticated user info missing in security context");
        }

        UserModel user = userRepositoryObj.findByUserEmail(email);
        log.debug("Resolved user from DB: {}", user == null ? "null" : ("id=" + user.getId() + ", email=" + user.getUserEmail()));
        if (user == null) {
            throw new NotFoundException("Authenticated user not found: " + email);
        }

        if (request == null || request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }

        OrderModel order = new OrderModel();
        order.setUser(user);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderItems(new ArrayList<>());

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItemModel> itemsToSave = new ArrayList<>();

        for (CreateOrderItemRequest itemReq : request.getOrderItems()) {

            Integer productId = itemReq.getProductId();
            if (productId == null) {
                throw new BadRequestException("productId is required for each order item");
            }

            ProductModel product = productRepositryObj.findById(productId)
                    .orElseThrow(() -> new NotFoundException("Product not found: " + productId));

            BigDecimal priceAtTime;
            if (product.getPrice() != null) {
                priceAtTime = product.getPrice();
            } else {
                throw new BadRequestException("Price not available for product: " + productId);
            }

            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Invalid quantity for product: " + productId);
            }

            BigDecimal lineTotal = priceAtTime.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(lineTotal);

            OrderItemModel itemEntity = new OrderItemModel();
            itemEntity.setProduct(product);
            itemEntity.setOrder(order);
            itemEntity.setPriceAtTime(priceAtTime);
            itemEntity.setQuantity(itemReq.getQuantity());
            itemEntity.setPayload(itemReq.getPayload());

            itemsToSave.add(itemEntity);
        }

        order.setTotalAmount(total);
        order.setOrderItems(itemsToSave);

        // Save order first (so it gets an id), then save items and re-attach
        OrderModel savedOrder = orderRepositryObj.save(order);
        log.debug("Order persisted with id = {}", savedOrder.getId());

        List<OrderItemModel> persistedItems = new ArrayList<>();
        for (OrderItemModel it : itemsToSave) {
            it.setOrder(savedOrder);
            OrderItemModel savedItem = orderItemRepositryObj.save(it);
            persistedItems.add(savedItem);
            log.debug("Saved order item id={} for productId={}", savedItem.getId(),
                    savedItem.getProduct() != null ? savedItem.getProduct().getId() : null);
        }

        savedOrder.setOrderItems(persistedItems);
        savedOrder = orderRepositryObj.save(savedOrder); // update relation
        log.debug("Finalized order {} with {} items", savedOrder.getId(), persistedItems.size());

        return toOrderResponse(savedOrder);
    }

    public List<OrderResponse> getOrdersForUser(UserDetails userDetails) {

        String email = userDetails == null ? null : userDetails.getUsername();
        log.debug("getOrdersForUser called. jwt-subject/email = {}", email);

        if (email == null) {
            throw new BadRequestException("Authenticated user info missing in security context");
        }

        UserModel user = userRepositoryObj.findByUserEmail(email);
        log.debug("Resolved user from DB: {}", user == null ? "null" : ("id=" + user.getId() + ", email=" + user.getUserEmail()));

        if (user == null) {
            throw new NotFoundException("Authenticated user not found: " + email);
        }

        List<OrderModel> orders = orderRepositryObj.findByUser(user);
        List<OrderResponse> responses = new ArrayList<>();
        for (OrderModel o : orders) {
            responses.add(toOrderResponse(o));
        }
        return responses;
    }

    public OrderResponse getOrderForUserById(Integer orderId, UserDetails userDetails) {
        String email = userDetails == null ? null : userDetails.getUsername();
        log.debug("getOrderForUserById called. jwt-subject/email = {}, orderId={}", email, orderId);

        if (email == null) {
            throw new BadRequestException("Authenticated user info missing in security context");
        }

        UserModel user = userRepositoryObj.findByUserEmail(email);
        if (user == null) {
            throw new NotFoundException("Authenticated user not found: " + email);
        }

        OrderModel order = orderRepositryObj.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new NotFoundException("Order not found or access denied: " + orderId));

        return toOrderResponse(order);
    }

    public String cancelOrderByUser(Integer orderId, UserDetails userDetails) {

        String email = userDetails == null ? null : userDetails.getUsername();
        log.debug("cancelOrderByUser called. jwt-subject/email = {}, orderId={}", email, orderId);

        if (email == null) {
            throw new BadRequestException("Authenticated user info missing in security context");
        }

        UserModel user = userRepositoryObj.findByUserEmail(email);
        if (user == null) {
            throw new NotFoundException("Authenticated user not found: " + email);
        }

        OrderModel order = orderRepositryObj.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

        // safer comparison for Integer
        if (order.getUser() == null || !Objects.equals(order.getUser().getId(), user.getId())) {
            throw new BadRequestException("Access denied: not your order");
        }

        // only allow user to cancel when order is PENDING
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Order cannot be cancelled in its current state: " + order.getOrderStatus());
        }

        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            orderItemRepositryObj.deleteAll(order.getOrderItems());
        }

        orderRepositryObj.delete(order);

        log.debug("Order {} cancelled by user id={}", orderId, user.getId());
        return "Order cancelled successfully";
    }

    public String cancelOrderByAdmin(Integer orderId, UserDetails adminUser) {

        if (adminUser == null || adminUser.getAuthorities() == null
                || adminUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("Access denied: admin privileges required");
        }

        String email = adminUser.getUsername();
        UserModel admin = userRepositoryObj.findByUserEmail(email);
        if (admin == null) {
            throw new NotFoundException("Authenticated admin not found: " + email);
        }

        OrderModel order = orderRepositryObj.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

        if (order.getOrderStatus() == OrderStatus.SHIPPED) {
            throw new BadRequestException("Cannot cancel an order that has already been shipped");
        }

        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            orderItemRepositryObj.deleteAll(order.getOrderItems());
        }

        orderRepositryObj.delete(order);

        log.debug("Order {} cancelled by admin id={}", orderId, admin.getId());
        return "Order cancelled by admin successfully";
    }

    public List<OrderResponse> getAllOrders() {

        List<OrderModel> all = orderRepositryObj.findAll();
        List<OrderResponse> res = new ArrayList<>();

        for (OrderModel o : all) {
            res.add(toOrderResponse(o));
        }

        return res;
    }

    public OrderResponse getOrderByIdAdmin(Integer orderId) {

        OrderModel order = orderRepositryObj.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

        return toOrderResponse(order);
    }

    public OrderResponse updateOrderStatus(Integer orderId, UpdateOrderStatusRequest dto, UserDetails adminUser) {

        OrderModel order = orderRepositryObj.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

        String newStatusStr = dto.getStatus();
        OrderStatus newStatus;

        try {
            newStatus = OrderStatus.valueOf(newStatusStr);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid order status: " + newStatusStr);
        }

        OrderStatus current = order.getOrderStatus();

        if (current == OrderStatus.SHIPPED && newStatus == OrderStatus.PENDING) {
            throw new BadRequestException("Cannot set status from SHIPPED back to PENDING");
        }
        if (current == OrderStatus.CANCELED && newStatus == OrderStatus.PENDING) {
            throw new BadRequestException("Cannot set status from CANCELLED back to PENDING");
        }

        order.setOrderStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());

        OrderModel saved = orderRepositryObj.save(order);

        log.debug("Order {} status changed to {} by admin {}", orderId, newStatus, adminUser != null ? adminUser.getUsername() : "unknown");

        return toOrderResponse(saved);
    }

    private OrderResponse toOrderResponse(OrderModel order) {

        if (order == null) return null;

        OrderResponse resp = new OrderResponse();

        resp.setId(order.getId());
        resp.setStatus(order.getOrderStatus() != null ? order.getOrderStatus().name() : null);

        if (order.getUser() != null) {
            resp.setUserId(order.getUser().getId());
        }

        resp.setTotalAmount(order.getTotalAmount());
        resp.setCreatedAt(order.getCreatedAt());
        resp.setUpdatedAt(order.getUpdatedAt());

        List<com.ribbony.ribbony.Modules.OrderModule.dto.OrderItemResponse> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItemModel it : order.getOrderItems()) {
                com.ribbony.ribbony.Modules.OrderModule.dto.OrderItemResponse ir = new com.ribbony.ribbony.Modules.OrderModule.dto.OrderItemResponse();
                ir.setId(it.getId());
                ir.setProductId(it.getProduct() != null ? it.getProduct().getId() : null);
                ir.setProductName(it.getProduct() != null ? it.getProduct().getProductName() : null);
                ir.setPriceAtTime(it.getPriceAtTime());
                ir.setQuantity(it.getQuantity());
                ir.setPayload(it.getPayload());
                items.add(ir);
            }
        }
        resp.setOrderItems(items);

        return resp;
    }
}
