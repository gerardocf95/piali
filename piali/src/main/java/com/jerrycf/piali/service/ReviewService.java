package com.jerrycf.piali.service;


import com.jerrycf.piali.exception.ResourceNotFoundException;
import com.jerrycf.piali.model.DTO.review.ReviewRequest;
import com.jerrycf.piali.model.DTO.review.ReviewResponse;
import com.jerrycf.piali.model.entity.Destination;
import com.jerrycf.piali.model.entity.Review;
import com.jerrycf.piali.model.entity.User;
import com.jerrycf.piali.repository.DestinationRepository;
import com.jerrycf.piali.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DestinationRepository destinationRepository;

    /*****  POST  *****/
    public ReviewResponse createReview(ReviewRequest request, User author) {
        Destination destination = destinationRepository.findById(request.destinationId())
                .orElseThrow(() -> new ResourceNotFoundException("El destino no existe para crear esta reseña"));

        Review review = new Review();
        review.setMessage(request.message());
        review.setStars(request.stars());
        review.setDestination(destination);
        review.setAuthor(author);
        return ReviewResponse.from(reviewRepository.save(review));
    }

    /*****  GET  *****/
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByStarsDescCreatedAtDesc().stream()
                .map(ReviewResponse::from)
                .toList();
    }

    public List<ReviewResponse> getReviewsWithComments() {
        return reviewRepository.findAllByMessageNotNullOrderByStarsDescCreatedAtDesc().stream()
                .filter(review -> !review.getMessage().isBlank())
                .map(ReviewResponse::from)
                .toList();
    }

    public Double getTotalAverageRating() {
        return reviewRepository.findAll().stream()
                .collect(Collectors.averagingDouble(Review::getStars));
    }

    public Double getAverageRatingByDestination(Long id) {
        List<Review> reviewByDestination = reviewRepository.findByDestination_Id(id);
        if (!destinationRepository.existsById(id) || reviewByDestination.isEmpty()) {
            return null;
        }
        return reviewByDestination.stream()
                .collect(Collectors.averagingDouble(Review::getStars));

    }


    /*****  DELETE  *****/
    public void deleteReview(Long id){
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reseña con id: " + id + " no encontrada para eliminar");
        }
        reviewRepository.deleteById(id);
    }




}
