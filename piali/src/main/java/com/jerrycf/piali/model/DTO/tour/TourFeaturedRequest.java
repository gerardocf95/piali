package com.jerrycf.piali.model.DTO.tour;

import jakarta.validation.constraints.NotNull;

public record TourFeaturedRequest(
        @NotNull Boolean featured
) {
}
