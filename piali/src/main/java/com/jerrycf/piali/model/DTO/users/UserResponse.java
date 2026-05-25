package com.jerrycf.piali.model.DTO.users;

import com.jerrycf.piali.model.entity.Role;
import com.jerrycf.piali.model.entity.User;

public record UserResponse(Long id, String email, String firstName, String lastName, Role role) {

    public static UserResponse from(User user){
        return new UserResponse(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
    }
}
