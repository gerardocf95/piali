package com.jerrycf.piali.service;


import com.jerrycf.piali.exception.ResourceNotFoundException;
import com.jerrycf.piali.model.DTO.review.ReviewRequest;
import com.jerrycf.piali.model.DTO.review.ReviewResponse;
import com.jerrycf.piali.model.entity.Review;
import com.jerrycf.piali.model.entity.User;
import com.jerrycf.piali.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    /*****  POST  *****/
    public ReviewResponse createReview(ReviewRequest request, User author) {
        Review review = new Review();
        review.setMessage(request.message());
        review.setStars(request.stars());
        review.setDestinationId(request.destinationId());
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
        return reviewRepository.findAllByMessageNotNull().stream()
                .filter(review -> !review.getMessage().isBlank())
                .map(ReviewResponse::from)
                .toList();
    }

    public Double getTotalAverageRating() {
        return reviewRepository.findAll().stream()
                .collect(Collectors.averagingDouble(Review::getStars));
    }

    public Double getAverageRatingByDestination(Long id) {
        return reviewRepository.findByDestinationId(id).stream()
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
