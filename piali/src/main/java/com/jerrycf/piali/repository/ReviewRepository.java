package com.jerrycf.piali.repository;

import com.jerrycf.piali.model.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = {"author", "destination"})
    List<Review> findAllByOrderByStarsDescCreatedAtDesc();

    @EntityGraph(attributePaths = {"author", "destination"})
    List<Review> findAllByMessageNotNullOrderByStarsDescCreatedAtDesc();

    List<Review> findByDestination_Id(Long destinationId);

}
