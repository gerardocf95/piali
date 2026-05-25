package com.jerrycf.piali.model.DTO.tour;

import com.jerrycf.piali.model.DTO.destination.DestinationResponse;
import com.jerrycf.piali.model.entity.*;

import java.time.LocalDateTime;

public record TourResponse(
        Long id,
        DestinationResponse destination,
        String name,
        String description,
        String imageUrl,
        TourType tourType,
        DifficultyLevel difficultyLevel,
        Double pricePerPerson,
        Double childPrice,
        Integer durationDays,
        Integer nights,
        Integer minGroupSize,
        Integer maxGroupSize,
        String departurePoint,
        TransportType transportType,
        String includes,
        String notIncludes,
        String itinerary,
        Boolean available,
        Boolean featured,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static TourResponse from(Tour tour) {

        return new  TourResponse(
                tour.getId(),
                DestinationResponse.from(tour.getDestination()),
                tour.getName(),
                tour.getDescription(),
                tour.getImageUrl(),
                tour.getTourType(),
                tour.getDifficultyLevel(),
                tour.getPricePerPerson(),
                tour.getChildPrice(),
                tour.getDurationDays(),
                tour.getNights(),
                tour.getMinGroupSize(),
                tour.getMaxGroupSize(),
                tour.getDeparturePoint(),
                tour.getTransportType(),
                tour.getIncludes(),
                tour.getNotIncludes(),
                tour.getItinerary(),
                tour.getAvailable(),
                tour.getFeatured(),
                tour.getCreatedAt(),
                tour.getUpdatedAt()
        );
    }
}
