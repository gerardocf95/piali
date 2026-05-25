package com.jerrycf.piali.service;

import com.jerrycf.piali.exception.ResourceNotFoundException;
import com.jerrycf.piali.model.DTO.destination.DestinationImageDTO;
import com.jerrycf.piali.model.DTO.destination.DestinationRequest;
import com.jerrycf.piali.model.DTO.destination.DestinationResponse;
import com.jerrycf.piali.model.entity.Destination;
import com.jerrycf.piali.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DestinationService {
    public final DestinationRepository destinationRepository;

    /*****  GET  *****/
    public List<DestinationResponse> findAllDestinations() {

        return destinationRepository.findAll().stream()
                .map(DestinationResponse::from)
                .toList();
    }

    public DestinationResponse findDestinationById(Long id) {
        //Manage error handling if not existing
        return destinationRepository.findById(id).map(DestinationResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Destino con id " + id + " no encontrado"));
    }

    public List<DestinationResponse> findDestinationsByName(String name) {
        String cleanName = name.trim().toLowerCase();
        return destinationRepository.findByNameContainingIgnoreCase(cleanName).stream()
                .map(DestinationResponse::from)
                .toList();
    }

    public List<DestinationResponse> getAllFeaturedDestinations() {
        return destinationRepository.findByFeaturedOrderIsNotNullOrderByFeaturedOrder().stream()
                .map(DestinationResponse::from)
                .toList();
    }

    /*****  POST  *****/
    public DestinationResponse createNewDestination(DestinationRequest request) {
        if (destinationRepository.existsByNameIgnoreCase(request.name())){
            throw new IllegalArgumentException("Destino con nombre: " + request.name() + " ya fue creado anteriormente");
        }
        Destination destination = new Destination();
        updateDestinationFromRequest(destination,request);

        return DestinationResponse.from(destinationRepository.save(destination));
    }

    /*****  PUT  *****/
    public DestinationResponse updateDestination(Long id, DestinationRequest request) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destino con id " + id + " no encontrado para actualizar"));

        updateDestinationFromRequest(destination, request);

        return DestinationResponse.from(destinationRepository.save(destination));

    }

    public void updateDestinationFromRequest(Destination destination, DestinationRequest request){
        destination.setName(request.name());
        destination.setState(request.state());
        destination.setDescription(request.description());
        destination.setDistanceKmFromCDMX(request.distanceKmFromCDMX());
        destination.setBasePrice(request.basePrice());
        destination.setFeaturedOrder(request.featuredOrder());
        destination.setImageUrl(request.imageUrl());
    }

    public DestinationResponse updateDestinationImage(Long id, DestinationImageDTO dto) {
        Destination dest = destinationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Destino con id: " + id + " no encontrado para actualizar imagen"));

        dest.setImageUrl(dto.imageUrl());
        return DestinationResponse.from(destinationRepository.save(dest));
    }


    /*****  DELETE  *****/

    public void deleteDestinationById(Long id) {
        if (!destinationRepository.existsById(id)){
            throw new ResourceNotFoundException("Destino con id: " + id + " no encontrado para eliminar");
        }
        //TODO check for disabling instead of deleting
        destinationRepository.deleteById(id);
    }

    public void deleteAllDestinations() {
        destinationRepository.deleteAll();
    }

}