package com.jerrycf.piali.model.DTO.review;

import jakarta.validation.constraints.*;

public record ReviewRequest(
        String message,

        @NotNull(message = "El destino es obligatorio")
        Long destinationId,

        @Min(1) @Max(5)
        int stars
) {
}
