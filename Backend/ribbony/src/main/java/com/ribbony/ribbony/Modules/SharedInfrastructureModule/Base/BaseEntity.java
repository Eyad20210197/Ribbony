package com.ribbony.ribbony.Modules.SharedInfrastructureModule.Base;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Setter;
import lombok.Getter;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected int id;

    @Column(name = "created_at" ,updatable = false)
    @CreationTimestamp
    protected LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    protected LocalDateTime updatedAt;
}
