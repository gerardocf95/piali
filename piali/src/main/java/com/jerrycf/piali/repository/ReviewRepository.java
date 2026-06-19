package com.jerrycf.piali.repository;

import com.jerrycf.piali.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findAllByOrderByStarsDescCreatedAtDesc();

    List<Review> findAllByMessageNotNull();

    List<Review> findByDestinationId(Long destinationId);

}
