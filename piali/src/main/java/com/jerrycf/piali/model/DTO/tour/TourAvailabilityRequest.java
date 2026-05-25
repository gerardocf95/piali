package com.jerrycf.piali.model.DTO.tour;

import jakarta.validation.constraints.NotNull;

public record TourAvailabilityRequest(
        @NotNull(message = "La campo de disponibilidad es obligatorio")
        Boolean available
) {
}
