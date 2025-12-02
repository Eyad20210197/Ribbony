package com.ribbony.ribbony.Modules.SharedInfrastructureModule.Util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AdminPasswordHashGenerator {
    public static void main(String[] args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        String rawPassword = "Admin@123";  
        String hashedPassword = encoder.encode(rawPassword);

        System.out.println("Hashed Password: " + hashedPassword);
    }
}
