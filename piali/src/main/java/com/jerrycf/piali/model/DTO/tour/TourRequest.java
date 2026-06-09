package com.jerrycf.piali.model.DTO.tour;

import com.jerrycf.piali.model.entity.DifficultyLevel;
import com.jerrycf.piali.model.entity.TourType;
import com.jerrycf.piali.model.entity.TransportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record TourRequest(

        @NotNull(message = "El destino es obligatorio")
        Long destinationId,

        @NotBlank(message = "El nombre es obligatorio")
        String name,
        
        String description,

        String imageUrl,
        
        @NotNull
        TourType tourType,
        
        @NotNull
        DifficultyLevel difficultyLevel,
        
        @Positive(message = "El precio por persona debe ser mayor a cero")
        Double pricePerPerson,
        
        @PositiveOrZero(message = "El precio para niños no puede ser negativo")
        Double childPrice,
        
        @PositiveOrZero(message = "La duracion no puede ser negativa")
        Integer durationDays,
        
        @PositiveOrZero(message = "Las noches deben ser mayor a cero")
        Integer nights,
        
        @Positive(message = "La capacidad mínima debe ser mayor a cero")
        Integer minGroupSize,
        
        @Positive(message = "La capacidad máxima debe ser mayor a cero")
        Integer maxGroupSize,
        
        @NotBlank(message = "El punto de salida es obligatorio")
        String departurePoint,
        
        TransportType transportType,
        
        String includes,
        
        String notIncludes,
        
        String itinerary,

        Boolean featured
) {
}
