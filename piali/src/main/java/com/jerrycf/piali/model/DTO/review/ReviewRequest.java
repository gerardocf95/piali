package com.jerrycf.piali.model.DTO.review;

import jakarta.validation.constraints.*;

public record ReviewRequest(
        String message,

        Long destinationId,

        @Min(1) @Max(5)
        int stars
) {
}
