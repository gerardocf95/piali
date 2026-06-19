package com.jerrycf.piali.model.DTO.review;

import com.jerrycf.piali.model.DTO.users.UserResponse;
import com.jerrycf.piali.model.entity.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        UserResponse author,
        String message,
        Long destinationId,
        int stars,
        LocalDateTime createdAt
) {

    public static ReviewResponse from(Review r){
        return new ReviewResponse(
                r.getId(),
                UserResponse.from(r.getAuthor()),
                r.getMessage(),
                r.getDestinationId(),
                r.getStars(),
                r.getCreatedAt()
        );
    }
}
