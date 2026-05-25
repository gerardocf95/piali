package com.jerrycf.piali.repository;

import com.jerrycf.piali.model.entity.Tour;
import com.jerrycf.piali.model.entity.TourType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByNameContainingIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Tour> findByDestinationId(Long destinationId);

    List<Tour> findByFeaturedTrue();

    List<Tour> findByTourType(TourType tourType);

    List<Tour> findByAvailableTrue();
}
