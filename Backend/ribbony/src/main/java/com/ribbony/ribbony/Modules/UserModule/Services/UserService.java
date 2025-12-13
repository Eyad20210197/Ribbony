package com.ribbony.ribbony.Modules.UserModule.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;
import com.ribbony.ribbony.Modules.UserModule.Models.UserRole;
import com.ribbony.ribbony.Modules.UserModule.Repo.UserRepositry;
import com.ribbony.ribbony.Modules.UserModule.dto.ChangeEmailRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.ChangePasswordRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.CreateUserRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.UpdateUserRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.UserResponse;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.BadRequestException;
import com.ribbony.ribbony.Modules.SharedInfrastructureModule.exception.NotFoundException;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepositry userRepositryObj;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse getUser(int id) {
        Optional<UserModel> optionalUser = userRepositryObj.findById(id);
        UserModel user = optionalUser.orElseThrow(
                () -> new NotFoundException("User not found with id: " + id)
        );

        return buildUserResponse(user);
    }

    public UserResponse addUser(CreateUserRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        UserModel existingUser = userRepositryObj.findByUserEmail(email);
        if (existingUser != null) {
            throw new BadRequestException("User already exists with email: " + email);
        }

        UserModel newUser = new UserModel();
        newUser.setUserEmail(email);
        newUser.setUserPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setUserFirstName(request.getFirstName());
        newUser.setUserLastName(request.getLastName());

        try {
            newUser.setUserRole(UserRole.valueOf(request.getRole()));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role: " + request.getRole());
        }

        newUser.setUserAddress(request.getAddress());

        UserModel savedUser = userRepositryObj.save(newUser);

        return buildUserResponse(savedUser);
    }

    public String deleteUser(int id) {

        if (!userRepositryObj.existsById(id)) {
            throw new NotFoundException("User not found with id: " + id);
        }

        userRepositryObj.deleteById(id);

        return "User deleted with id: " + id;
    }

    public UserResponse updateUser(UpdateUserRequest request) {

        int id = request.getId();

        Optional<UserModel> optionalUser = userRepositryObj.findById(id);
        UserModel user = optionalUser.orElseThrow(
                () -> new NotFoundException("User not found with id: " + id)
        );

        if (request.getFirstName() != null) {
            user.setUserFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setUserLastName(request.getLastName());
        }
        if (request.getAddress() != null) {
            user.setUserAddress(request.getAddress());
        }
        if (request.getRole() != null) {
            try {
                user.setUserRole(UserRole.valueOf(request.getRole()));
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid role: " + request.getRole());
            }
        }

        UserModel updatedUser = userRepositryObj.save(user);

        return buildUserResponse(updatedUser);
    }

    public UserResponse changeUserPassword(ChangePasswordRequest request) {

        Optional<UserModel> optionalUser = userRepositryObj.findById(request.getId());
        UserModel user = optionalUser.orElseThrow(
                () -> new NotFoundException("User not found with id: " + request.getId())
        );
        user.setUserPassword(passwordEncoder.encode(request.getNewPassword()));
        UserModel updatedUser = userRepositryObj.save(user);

        return buildUserResponse(updatedUser);
    }

    public UserResponse changeUserEmail(ChangeEmailRequest request) {

        String newEmail = request.getNewEmail().trim().toLowerCase();

        UserModel existingWithEmail = userRepositryObj.findByUserEmail(newEmail);
        if (existingWithEmail != null && existingWithEmail.getId() != request.getId()) {
            throw new BadRequestException("Email is already used by another user: " + newEmail);
        }

        Optional<UserModel> optionalUser = userRepositryObj.findById(request.getId());
        UserModel user = optionalUser.orElseThrow(
                () -> new NotFoundException("User not found with id: " + request.getId())
        );

        user.setUserEmail(newEmail);

        UserModel updatedUser = userRepositryObj.save(user);

        return buildUserResponse(updatedUser);
    }

    private UserResponse buildUserResponse(UserModel user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFirstName(user.getUserFirstName());
        response.setLastName(user.getUserLastName());
        response.setRole(user.getUserRole() != null ? user.getUserRole().name() : null);

        return response;
    }
}
