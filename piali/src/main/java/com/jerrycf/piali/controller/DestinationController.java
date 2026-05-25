package com.jerrycf.piali.controller;

import com.jerrycf.piali.model.DTO.destination.DestinationImageDTO;
import com.jerrycf.piali.model.DTO.destination.DestinationRequest;
import com.jerrycf.piali.model.DTO.destination.DestinationResponse;
import com.jerrycf.piali.model.entity.Destination;
import com.jerrycf.piali.service.DestinationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    /*****  GET  *****/
    @GetMapping
    public ResponseEntity<List<DestinationResponse>> findAllDestinations() {
        return ResponseEntity.ok(destinationService.findAllDestinations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationResponse> findDestinationById(@PathVariable Long id) {
        return ResponseEntity.ok(destinationService.findDestinationById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DestinationResponse>> findDestinationsBySearch(@RequestParam String name) {
        return ResponseEntity.ok(destinationService.findDestinationsByName(name));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<DestinationResponse>> getAllFeaturedDestinations() {
        return ResponseEntity.ok(destinationService.getAllFeaturedDestinations());
    }

    /***** POST  *****/
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DestinationResponse> createDestination(@Valid @RequestBody DestinationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(destinationService.createNewDestination(request));
    }

    /***** PUT  *****/

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DestinationResponse> updateDestination(@PathVariable Long id, @Valid @RequestBody DestinationRequest request) {
        return ResponseEntity.ok(destinationService.updateDestination(id, request));
    }

    @PutMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DestinationResponse> updateDestinationImage(@PathVariable Long id, @Valid @RequestBody DestinationImageDTO dto){
        return ResponseEntity.ok(destinationService.updateDestinationImage(id, dto));
    }

    /*****  DELETE  *****/
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long id) {

        destinationService.deleteDestinationById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAllDestinations() {
        destinationService.deleteAllDestinations();
    }

}
