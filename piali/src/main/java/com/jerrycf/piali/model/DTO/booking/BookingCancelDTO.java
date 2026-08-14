package com.jerrycf.piali.model.DTO.booking;

import jakarta.validation.constraints.NotNull;

public record BookingCancelDTO(
        @NotNull
        Boolean available
) {
}
