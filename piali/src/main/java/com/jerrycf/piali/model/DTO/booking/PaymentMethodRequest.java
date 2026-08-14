package com.jerrycf.piali.model.DTO.booking;

import com.jerrycf.piali.model.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public record PaymentMethodRequest(
        @NotNull
        PaymentMethod paymentMethod
) {
}
