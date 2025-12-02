package com.ribbony.ribbony.Modules.UserModule.Repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;

public interface UserRepositry extends JpaRepository<UserModel, Integer> {

    boolean existsByUserEmail(String userEmail);

    UserModel findByUserEmail(String userEmail);
}

