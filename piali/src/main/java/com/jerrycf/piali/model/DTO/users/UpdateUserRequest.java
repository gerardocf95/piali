package com.jerrycf.piali.model.DTO.users;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(@NotBlank String firstName, @NotBlank String lastName) {
}
