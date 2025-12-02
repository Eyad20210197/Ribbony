package com.ribbony.ribbony.Modules.AuthModule.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ribbony.ribbony.Modules.UserModule.Models.UserModel;

import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {

    private final UserModel userModelObj;

    public UserDetailsImpl(UserModel userModelObj) {
        this.userModelObj = userModelObj;
    }

    @Override
    public String getUsername() {
        return userModelObj.getUserEmail();
    }

    @Override
    public String getPassword() {
        return userModelObj.getUserPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userModelObj.getUserRole().name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
