package com.jerrycf.piali.model.DTO.review;

import com.jerrycf.piali.model.DTO.destination.DestinationResponse;
import com.jerrycf.piali.model.DTO.users.UserResponse;
import com.jerrycf.piali.model.entity.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        UserResponse author,
        String message,
        DestinationResponse destination,
        int stars,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static ReviewResponse from(Review r){
        return new ReviewResponse(
                r.getId(),
                UserResponse.from(r.getAuthor()),
                r.getMessage(),
                DestinationResponse.from(r.getDestination()),
                r.getStars(),
                r.getCreatedAt(),
                r.getUpdatedAt()
        );
    }
}
