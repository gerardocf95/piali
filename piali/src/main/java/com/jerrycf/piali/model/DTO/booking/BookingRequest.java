package com.jerrycf.piali.model.DTO.booking;


import com.jerrycf.piali.model.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record BookingRequest(
        @NotNull
        Long tourId,

        @Positive
        int adults,

        @PositiveOrZero
        int children,

        @NotNull
        PaymentMethod paymentMethod,

        String notes
) {
}
