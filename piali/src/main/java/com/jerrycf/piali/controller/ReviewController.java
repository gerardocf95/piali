package com.jerrycf.piali.controller;

import com.jerrycf.piali.model.DTO.review.ReviewRequest;
import com.jerrycf.piali.model.DTO.review.ReviewResponse;
import com.jerrycf.piali.model.entity.User;
import com.jerrycf.piali.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /*****  POST  *****/
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request, @AuthenticationPrincipal User author) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(request, author));
    }

    /*****  GET  *****/
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/with-comments")
    public ResponseEntity<List<ReviewResponse>> getReviewsWithComments() {
        return ResponseEntity.ok(reviewService.getReviewsWithComments());
    }

    @GetMapping("/average")
    public ResponseEntity<Double> getAverageRating() {
        return ResponseEntity.ok(reviewService.getTotalAverageRating());
    }

    @GetMapping("/average/{id}")
    public ResponseEntity<Double> getAverageRatingByDestination(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getAverageRatingByDestination(id));
    }

    /*****  DELETE  *****/
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();

    }

}
