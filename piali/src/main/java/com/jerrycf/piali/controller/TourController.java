package com.jerrycf.piali.controller;

import com.jerrycf.piali.model.DTO.tour.TourAvailabilityRequest;
import com.jerrycf.piali.model.DTO.tour.TourFeaturedRequest;
import com.jerrycf.piali.model.DTO.tour.TourRequest;
import com.jerrycf.piali.model.DTO.tour.TourResponse;
import com.jerrycf.piali.model.entity.TourType;
import com.jerrycf.piali.service.TourService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    /*****  GET  *****/
    @GetMapping
    public ResponseEntity<List<TourResponse>> findAllTours(){
        return ResponseEntity.ok(tourService.getAllTours());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourResponse> findTourById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getTourById(id));
    }

    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<List<TourResponse>> findToursByDestinationId(@PathVariable Long destinationId) {
        return ResponseEntity.ok(tourService.getToursByDestination(destinationId));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<TourResponse>> getFeaturedTours() {
        return ResponseEntity.ok(tourService.getFeaturedTours());
    }

    @GetMapping("/type/{tourType}")
    public ResponseEntity<List<TourResponse>> getToursByTourType(@PathVariable TourType tourType){
        return ResponseEntity.ok(tourService.getToursByType(tourType));
    }

    @GetMapping("/available")
    public ResponseEntity<List<TourResponse>> getAllAvailableTours() {
        return ResponseEntity.ok(tourService.getAllAvailableTours());
    }

    /*****  POST  *****/
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourResponse> createNewTour(@Valid @RequestBody TourRequest tourRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(tourService.createNewTour(tourRequest));
    }

    /*****  PUT  *****/
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourResponse> updateTourById(@PathVariable Long id, @Valid @RequestBody TourRequest tourRequest) {
        return ResponseEntity.ok(tourService.updateTourById(id, tourRequest));
    }

    /*****  PATCH  *****/
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourResponse> updateTourAvailabilityById(@PathVariable Long id, @Valid @RequestBody TourAvailabilityRequest request) {
        return ResponseEntity.ok(tourService.updateTourAvailabilityById(id, request));
    }

    @PatchMapping("/{id}/featured")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourResponse> updateFeaturedTourById(@PathVariable Long id, @Valid @RequestBody TourFeaturedRequest request) {
        return ResponseEntity.ok(tourService.updateTourFeaturedById(id,request));
    }

    /*****  DELETE  *****/
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTourById(@PathVariable Long id) {
        tourService.deleteTourById(id);
        return ResponseEntity.noContent().build();
    }

}
