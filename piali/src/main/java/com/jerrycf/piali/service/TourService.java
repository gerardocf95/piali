package com.jerrycf.piali.service;

import com.jerrycf.piali.exception.ResourceNotFoundException;
import com.jerrycf.piali.model.DTO.tour.TourAvailabilityRequest;
import com.jerrycf.piali.model.DTO.tour.TourFeaturedRequest;
import com.jerrycf.piali.model.DTO.tour.TourRequest;
import com.jerrycf.piali.model.DTO.tour.TourResponse;
import com.jerrycf.piali.model.entity.Destination;
import com.jerrycf.piali.model.entity.Tour;
import com.jerrycf.piali.model.entity.TourType;
import com.jerrycf.piali.repository.DestinationRepository;
import com.jerrycf.piali.repository.TourRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;
    private final DestinationRepository destinationRepository;


    /*****  GET  *****/
    public List<TourResponse> getAllTours(){
        return tourRepository.findAll().stream()
                .map(TourResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TourResponse getTourById(Long id) {
        return tourRepository.findById(id)
                .map(TourResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Tour con id: " + id + " no encontrado."));
    }

    public List<TourResponse> getToursByDestination(Long destinationId) {
        if (!destinationRepository.existsById(destinationId)) {
            throw new  ResourceNotFoundException("Tour con Destination id: " + destinationId + " no encontrado.");
        }
        return tourRepository.findByDestinationId(destinationId).stream()
                .map(TourResponse::from)
                .toList();

    }

    public List<TourResponse> getFeaturedTours() {
        return tourRepository.findByFeaturedTrue().stream()
                .map(TourResponse::from)
                .toList();
    }

    public List<TourResponse> getToursByType(TourType tourType) {
        return tourRepository.findByTourType(tourType).stream()
                .map(TourResponse::from)
                .toList();
    }

    public List<TourResponse> getAllAvailableTours() {
        return tourRepository.findByAvailableTrue().stream()
                .map(TourResponse::from)
                .toList();
    }

    /***** POST  *****/
    public TourResponse createNewTour(TourRequest request) {
        if (tourRepository.existsByNameIgnoreCase(request.name())){
            throw new IllegalArgumentException("Tour ya existente con nombre: " + request.name());
        }

        Tour tour = new Tour();
        updateTourFromRequest(tour,request);

        return TourResponse.from(tourRepository.save(tour));
    }

    /***** PUT  *****/
    public TourResponse updateTourById(Long id, TourRequest request) {
        //Tour tour = tourRepository.findById(id)
        //        .orElseThrow(() -> new ResourceNotFoundException("Tour id: " + id + " no encontrado para actualizar."));
        Tour tour = getTour(id);

        updateTourFromRequest(tour, request);

        return TourResponse.from(tourRepository.save(tour));
    }


    /*****   PATCH  *****/
    public TourResponse updateTourAvailabilityById(Long id, TourAvailabilityRequest request) {
        //Tour tour = tourRepository.findById(id)
        //        .orElseThrow(() -> new ResourceNotFoundException("Tour id: " + id + " no encontrado para cambiar disponibilidad."));
        Tour tour = getTour(id);

        tour.setAvailable(request.available());
        return TourResponse.from(tourRepository.save(tour));
    }

    public TourResponse updateTourFeaturedById(Long id, TourFeaturedRequest request) {
        Tour tour = getTour(id);
        tour.setFeatured(request.featured());

        return TourResponse.from(tourRepository.save(tour));
    }

    /*****   DELETE  *****/
    public void deleteTourById(Long id) {
        if (!tourRepository.existsById(id)){
            throw new ResourceNotFoundException("Tour con id: " + id + " no encontrado para elminar.");
        }
        tourRepository.deleteById(id);
    }



    public Tour getTour(Long id) {
        return tourRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tour id: " + id + " no encontrado."));
    }


    public void updateTourFromRequest(Tour tour, TourRequest request) {
        tour.setName(request.name());
        tour.setDestination(destinationRepository.findById(request.destinationId())
                .orElseThrow(() -> new ResourceNotFoundException("destino con id " + request.destinationId() + " no encontrado.")));
        tour.setDescription(request.description());
        tour.setImageUrl(request.imageUrl());
        tour.setTourType(request.tourType());
        tour.setDifficultyLevel(request.difficultyLevel());
        tour.setPricePerPerson(request.pricePerPerson());
        tour.setChildPrice(request.childPrice());
        tour.setDurationDays(request.durationDays());
        tour.setNights(request.nights());
        tour.setMinGroupSize(request.minGroupSize());
        tour.setMaxGroupSize(request.maxGroupSize());
        tour.setDeparturePoint(request.departurePoint());
        tour.setTransportType(request.transportType());
        tour.setIncludes(request.includes());
        tour.setNotIncludes(request.notIncludes());
        tour.setItinerary(request.itinerary());
    }
}
