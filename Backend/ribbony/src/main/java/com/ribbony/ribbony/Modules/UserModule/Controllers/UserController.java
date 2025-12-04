package com.ribbony.ribbony.Modules.UserModule.Controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ribbony.ribbony.Modules.UserModule.Services.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import jakarta.validation.Valid;

import com.ribbony.ribbony.Modules.UserModule.dto.ChangeEmailRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.ChangePasswordRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.CreateUserRequest;
import com.ribbony.ribbony.Modules.UserModule.dto.UpdateUserRequest;

@RestController
@RequestMapping("/user")
public class UserController {
 
    @Autowired
    private UserService userServiceObj;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getUser/{id}")
    public ResponseEntity<?> getExistingUser(@PathVariable int id) {

        return ResponseEntity.ok(userServiceObj.getUser(id));

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addNewUser")
    public ResponseEntity<?> addNewUser(@Valid@RequestBody CreateUserRequest request, BindingResult result) {

        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        return ResponseEntity.ok(userServiceObj.addUser(request));

    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteAccount/{id}")
    public String deleteAccount(@PathVariable int id) {

        return userServiceObj.deleteUser(id); 

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateUser")
    public ResponseEntity<?> updateExistingUser(@Valid@RequestBody UpdateUserRequest request, BindingResult result) {

        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        return ResponseEntity.ok(userServiceObj.updateUser(request));

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/changeEmail")
    public String changeUserEmail(@RequestBody ChangeEmailRequest request) {
        
        userServiceObj.changeUserEmail(request);
        return "Email changed successfully";

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/changePassword")
    public String changeUserPassword(@RequestBody ChangePasswordRequest request) {
        
        userServiceObj.changeUserPassword(request);
        return "Password changed successfully";

    }
   
}
