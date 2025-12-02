package com.ribbony.ribbony.Modules.AuthModule.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;
import com.ribbony.ribbony.Modules.UserModule.Repo.UserRepositry;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private UserRepositry userRepositoryObj;

    @Override
    public UserDetails loadUserByUsername(String email) {
        UserModel user = userRepositoryObj.findByUserEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("No user found with email: " + email);
        }

        return new UserDetailsImpl(user);
    }

}
