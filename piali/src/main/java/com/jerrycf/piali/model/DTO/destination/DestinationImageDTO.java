package com.jerrycf.piali.model.DTO.destination;

import jakarta.validation.constraints.NotBlank;

public record DestinationImageDTO(@NotBlank String imageUrl) {
}
