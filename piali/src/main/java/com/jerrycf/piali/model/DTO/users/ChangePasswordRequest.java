package com.jerrycf.piali.model.DTO.users;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank String currentPassword,
        @Size(min = 8) String newPassword
) {
}
