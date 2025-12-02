package com.ribbony.ribbony.Modules.UserModule.Models;

import com.ribbony.ribbony.Modules.OrderModule.Models.OrderModel;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.Base.BaseEntity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.*;

@Entity 
@Table(name = "users")
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor  
public class UserModel extends BaseEntity {

   @OneToMany(mappedBy = "user")// Assuming OrderModel has a field 'user' that maps back to UserModel
   private List<OrderModel> orders;

   @NotBlank
   @Column(name = "first_name", nullable = false, length = 50)
   private String userFirstName; 

   @Column(name = "last_name", nullable = true, length = 50)
   private String userLastName; 

   @Email
   @NotBlank
   @Column(name = "email", nullable = false, unique = true, length = 100)
   private String userEmail;

   @NotBlank
   @Column(name = "password", nullable = false, length = 200)
   private String userPassword;

   @Column(name="address",length = 255)
   private String userAddress;
   
   @Enumerated(EnumType.STRING)
   @Column(name = "role", nullable = false)
   private UserRole userRole;

}
