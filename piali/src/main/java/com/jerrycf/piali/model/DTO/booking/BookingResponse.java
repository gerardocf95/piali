package com.jerrycf.piali.model.DTO.booking;

import com.jerrycf.piali.model.DTO.tour.TourResponse;
import com.jerrycf.piali.model.DTO.users.UserResponse;
import com.jerrycf.piali.model.entity.Booking;
import com.jerrycf.piali.model.entity.BookingStatus;
import com.jerrycf.piali.model.entity.PaymentMethod;
import com.jerrycf.piali.model.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        TourResponse tour,
        UserResponse user,
        int adults,
        int children,
        BigDecimal totalPrice,
        String notes,
        PaymentStatus paymentStatus,
        PaymentMethod paymentMethod,
        BookingStatus bookingStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static BookingResponse from(Booking b) {
        return new BookingResponse(
                b.getId(),
                TourResponse.from(b.getTour()),
                UserResponse.from(b.getUser()),
                b.getAdults(),
                b.getChildren(),
                b.getTotalPrice(),
                b.getNotes(),
                b.getPaymentStatus(),
                b.getPaymentMethod(),
                b.getBookingStatus(),
                b.getCreatedAt(),
                b.getUpdatedAt()
        );
    }
}
