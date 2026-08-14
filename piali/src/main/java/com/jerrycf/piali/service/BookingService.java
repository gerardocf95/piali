package com.jerrycf.piali.service;

import com.jerrycf.piali.exception.InvalidBookingException;
import com.jerrycf.piali.exception.UnauthorizedUserException;
import com.jerrycf.piali.exception.ResourceNotFoundException;
import com.jerrycf.piali.model.DTO.booking.BookingRequest;
import com.jerrycf.piali.model.DTO.booking.BookingResponse;
import com.jerrycf.piali.model.entity.*;
import com.jerrycf.piali.repository.BookingRepository;
import com.jerrycf.piali.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;

    /*****  POST  *****/
    @Transactional
    public BookingResponse createBooking(BookingRequest request, User user) {
        Booking booking = new Booking();

        Tour tour =  tourRepository.findById(request.tourId()).orElseThrow(() -> new ResourceNotFoundException("Tour con id " + request.tourId() + " no encontrado para reservar"));
        if (!tour.getAvailable()){
            throw new InvalidBookingException("Tour no disponible por el momento, contactar con el admin/guia del Tour");
        }
        if (tour.getDepartureDate() != null &&  tour.getDepartureDate().isBefore(LocalDateTime.now())){
            throw new InvalidBookingException("El Tour ya se realizó, contacta al admin/guía o espera nuevas noticias de los siguientes Tours");
        }

        int totalPeople = request.adults() + request.children();
        int currentAvailability = tour.getMaxGroupSize() - tour.getCurrentTravelers();

        if (totalPeople > currentAvailability) {
            throw new InvalidBookingException("No hay cupo para este total de personas, quedan " + currentAvailability + " espacios disponibles");
        }

        // Si childPrice es null, el precio es el mismo que adulto
        BigDecimal childPrice = tour.getChildPrice() != null ? tour.getChildPrice() : tour.getAdultPrice();

        BigDecimal adultsTotal = tour.getAdultPrice().multiply(BigDecimal.valueOf(request.adults()));
        BigDecimal childrenTotal = childPrice.multiply(BigDecimal.valueOf(request.children()));
        BigDecimal totalPrice = adultsTotal.add(childrenTotal);

        // Actualizar la disponibilidad del tour una vez validado el cupo
        tour.setCurrentTravelers(tour.getCurrentTravelers() + totalPeople);

        booking.setTour(tour);
        booking.setUser(user);
        booking.setAdults(request.adults());
        booking.setChildren(request.children());
        booking.setTotalPrice(totalPrice);
        booking.setNotes(request.notes());
        booking.setPaymentMethod(request.paymentMethod());

        // La reserva siempre nace PENDING. El pago en línea es por ahora un placeholder
        // (sin pasarela real): solo se registra el método elegido, no se cobra ni se marca
        // como pagada. Cuando se integre la pasarela, ONLINE pasará a PAID/CONFIRMED aquí.
        // TODO integrar pasarela de pago en línea
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setBookingStatus(BookingStatus.PENDING);

        return BookingResponse.from(bookingRepository.save(booking));
    }

    /*****  GET  *****/

    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByTourDepartureDate(userId).stream()
                .map(BookingResponse::from)
                .toList();
    }

    public List<BookingResponse> getMyBookings(User user) {
        return bookingRepository.findByUserOrderByTourDepartureDate(user).stream()
                .map(BookingResponse::from)
                .toList();
    }

    /*****  PATCH  *****/

    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatus bookingStatus) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ocurrió un error al actualizar el estatus de reserva con id " + id);
        }

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva con id " + id + "no encontrado para cancelar"));

        updateCurrentTravelersOfTour(booking, bookingStatus);
        booking.setBookingStatus(bookingStatus);
        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva con id " + id + " no encontrada para cancelar"));

        if (booking.getUser() == null || !booking.getUser().getId().equals(user.getId())){
            throw new UnauthorizedUserException("Acción inválida para este usuario");
        }

        if (booking.getBookingStatus().equals(BookingStatus.CANCELLED)) {
            throw new InvalidBookingException("La reserva ya está cancelada");
        }
        if (booking.getBookingStatus().equals(BookingStatus.COMPLETED)) {
            throw new InvalidBookingException("No se puede cancelar una reserva de un tour ya completado");
        }
        LocalDateTime departureDate = booking.getTour().getDepartureDate();
        if (departureDate != null && departureDate.isBefore(LocalDateTime.now())) {
            throw new InvalidBookingException("No se puede cancelar una reserva de un tour cuya fecha de salida ya pasó");
        }

        // Se puede cancelar aunque ya esté pagada en línea; la devolución del dinero
        // (paymentStatus REFUNDED) se implementará cuando exista la pasarela real.
        // TODO manejar reembolso cuando paymentStatus == PAID
        updateCurrentTravelersOfTour(booking, BookingStatus.CANCELLED);
        booking.setBookingStatus(BookingStatus.CANCELLED);

        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse updatePaymentMethod(Long id, PaymentMethod paymentMethod, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva con id " + id + " no encontrada"));

        if (booking.getUser() == null || !booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedUserException("Acción inválida para este usuario");
        }

        if (booking.getBookingStatus().equals(BookingStatus.CANCELLED)
                || booking.getBookingStatus().equals(BookingStatus.COMPLETED)) {
            throw new InvalidBookingException("No se puede cambiar la forma de pago de una reserva cancelada o completada");
        }

        // Una vez pagada en línea el cobro ya se realizó, no se permite cambiar el método.
        if (booking.getPaymentStatus().equals(PaymentStatus.PAID)) {
            throw new InvalidBookingException("La reserva ya fue pagada, no es posible cambiar la forma de pago");
        }

        booking.setPaymentMethod(paymentMethod);
        return BookingResponse.from(bookingRepository.save(booking));
    }

    /*****  DELETE  *****/

    @Transactional
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reservacion con id " + id + " no encontrada para eliminar");
        }

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva con id " + id + "no encontrado para eliminar"));

        updateCurrentTravelersOfTour(booking, BookingStatus.CANCELLED);
        bookingRepository.deleteById(id);
    }

    public void updateCurrentTravelersOfTour(Booking booking, BookingStatus status){
        int numberPeople = booking.getAdults() + booking.getChildren();
        int currentTravelers = booking.getTour().getCurrentTravelers();
        if (status.equals(BookingStatus.CANCELLED)) { //Se deshabilita/elimina una reserva, disminuir la cantidad de viajeros del tour correspondiente, validar que por algun motivo no sea menor a 0
            if (!booking.getBookingStatus().equals(BookingStatus.CANCELLED)){
                if (numberPeople > currentTravelers){
                    booking.getTour().setCurrentTravelers(0);
                    // TODO agregar un warning
                } else {
                    booking.getTour().setCurrentTravelers(currentTravelers - numberPeople);
                }
            }
        } else { // Se habilita una reserva, aumentar la cantidad de viajeros verificar que no rebase cupo máximo si es que la reserva antes estaba cancelada
            if (numberPeople > booking.getTour().getMaxGroupSize() - currentTravelers){
                throw new InvalidBookingException("La cantidad de gente para esta reserva supera el grupo maximo del tour, comunicarse con el guia/admin del tour para verificar cupo");
            } else {
                if (booking.getBookingStatus().equals(BookingStatus.CANCELLED)){
                    booking.getTour().setCurrentTravelers(currentTravelers + numberPeople);
                }
            }
        }

    }
}
