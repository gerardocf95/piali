package com.jerrycf.piali.controller;


import com.jerrycf.piali.model.DTO.booking.BookingRequest;
import com.jerrycf.piali.model.DTO.booking.BookingResponse;
import com.jerrycf.piali.model.DTO.booking.PaymentMethodRequest;
import com.jerrycf.piali.model.entity.BookingStatus;
import com.jerrycf.piali.model.entity.User;
import com.jerrycf.piali.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /*****  POST  *****/
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request, user));
    }


    /*****  GET  *****/
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getMyBookings(user));
    }

    @GetMapping("/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getUserBookings(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getUserBookings(id));
    }

    /*****  PATCH  *****/
    @PatchMapping("/{bookingId}/booking-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam(name = "booking-status")BookingStatus bookingStatus) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, bookingStatus));
    }

    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long bookingId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, user));
    }

    @PatchMapping("/{bookingId}/payment-method")
    public ResponseEntity<BookingResponse> updatePaymentMethod(
            @PathVariable Long bookingId,
            @Valid @RequestBody PaymentMethodRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.updatePaymentMethod(bookingId, request.paymentMethod(), user));
    }


    /*****  DELETE  *****/
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

}
