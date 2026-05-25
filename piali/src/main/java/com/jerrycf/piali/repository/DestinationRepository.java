package com.jerrycf.piali.repository;

import com.jerrycf.piali.model.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByState(String state);

    List<Destination> findByNameContainingIgnoreCase(String name);

    // Devuelve solo los featured, ordenados
    List<Destination> findByFeaturedOrderIsNotNullOrderByFeaturedOrder();

    boolean existsByNameIgnoreCase(String name);
}

