package com.ribbony.ribbony.Modules.AuthModule.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ribbony.ribbony.Modules.AuthModule.dto.AuthResponse;
import com.ribbony.ribbony.Modules.AuthModule.dto.LoginRequest;
import com.ribbony.ribbony.Modules.AuthModule.dto.RegisterRequest;
import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;
import com.ribbony.ribbony.Modules.UserModule.Models.UserRole;
import com.ribbony.ribbony.Modules.UserModule.Repo.UserRepositry;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.BadRequestException;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.NotFoundException;

@Service
public class AuthService {

    @Autowired
    private UserRepositry userRepositryObj;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtServiceObj;

    public AuthResponse login(LoginRequest loginRequest) {

        String email = loginRequest.getEmail().trim().toLowerCase();

        UserModel user = userRepositryObj.findByUserEmail(email);

        if (user == null) {
            throw new NotFoundException("User not found with email: " + email);
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getUserPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        String token = jwtServiceObj.generateToken(user);

        return buildAuthResponse(user, token);
    }

    public AuthResponse register(RegisterRequest registerRequest) {

        String email = registerRequest.getEmail().trim().toLowerCase();

        if (userRepositryObj.existsByUserEmail(email)) {
            throw new BadRequestException("User already exists with email: " + email);
        }

        UserModel newUser = new UserModel();
        newUser.setUserEmail(email);
        newUser.setUserPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setUserFirstName(registerRequest.getFirstName());
        newUser.setUserLastName(registerRequest.getLastName());
        newUser.setUserRole(UserRole.USER);
        newUser.setUserAddress(registerRequest.getAddress());

        userRepositryObj.save(newUser);

        String token = jwtServiceObj.generateToken(newUser);

        return buildAuthResponse(newUser, token);
    }

    private AuthResponse buildAuthResponse(UserModel user, String token) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setId(user.getId());
        response.setRole(user.getUserRole().name());
        return response;
    }
}
