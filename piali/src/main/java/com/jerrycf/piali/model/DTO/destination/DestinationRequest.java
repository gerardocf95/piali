package com.jerrycf.piali.model.DTO.destination;

import com.jerrycf.piali.model.entity.MexicanState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record DestinationRequest(

        @NotBlank(message = "El nombre es obligatorio")
        String name,

        @NotNull(message = "El estado es obligatorio")
        MexicanState state,

        @PositiveOrZero
        int distanceKmFromCDMX,

        String description,

        String imageUrl,

        @PositiveOrZero
        Double basePrice,

        Integer featuredOrder
)
{ }
