package com.jerrycf.piali.model.DTO.tour;

import jakarta.validation.constraints.NotBlank;

public record TourFeaturedRequest(
        @NotBlank Boolean featured
) {
}
