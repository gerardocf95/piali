package com.jerrycf.piali.model.DTO.destination;

import com.jerrycf.piali.model.entity.Destination;

import java.time.LocalDateTime;

public record DestinationResponse(

        Long id,
        String name,
        String state,
        int distanceKmFromCDMX,
        String description,
        String imageUrl,
        Double basePrice,
        Integer featuredOrder,
        LocalDateTime createdAt
) {

    public static DestinationResponse from(Destination destination) {
        return new DestinationResponse(
                destination.getId(),
                destination.getName(),
                destination.getState().name(),
                destination.getDistanceKmFromCDMX(),
                destination.getDescription(),
                destination.getImageUrl(),
                destination.getBasePrice(),
                destination.getFeaturedOrder(),
                destination.getCreatedAt()
        );
    }
}
