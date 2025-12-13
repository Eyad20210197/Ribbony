package com.ribbony.ribbony.Modules.UserModule.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.ribbony.ribbony.Modules.UserModule.Services.UserService;
import com.ribbony.ribbony.Modules.UserModule.dto.ChangeEmailRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.ChangePasswordRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.CreateUserRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.UpdateUserRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.UserResponse;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userServiceObj;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getUser/{id}")
    public UserResponse getExistingUser(@PathVariable int id) {
        return userServiceObj.getUser(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addNewUser")
    public UserResponse addNewUser(@Valid @RequestBody CreateUserRequest request) {
        return userServiceObj.addUser(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteAccount/{id}")
    public String deleteAccount(@PathVariable int id) {
        return userServiceObj.deleteUser(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateUser")
    public UserResponse updateExistingUser(@Valid @RequestBody UpdateUserRequest request) {
        return userServiceObj.updateUser(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/changeEmail")
    public UserResponse changeUserEmail(@Valid @RequestBody ChangeEmailRequest request) {
        return userServiceObj.changeUserEmail(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/changePassword")
    public UserResponse changeUserPassword(@Valid @RequestBody ChangePasswordRequest request) {
        return userServiceObj.changeUserPassword(request);
    }

    // NOTE: validation and errors handled globally by GlobalExceptionHandler (@ControllerAdvice)
}
