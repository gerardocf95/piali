package com.jerrycf.piali.repository;

import com.jerrycf.piali.model.entity.Booking;
import com.jerrycf.piali.model.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @EntityGraph(attributePaths = {"tour","tour.destination","user"})
    List<Booking> findByUserOrderByTourDepartureDate(User user);

    @EntityGraph(attributePaths = {"tour","tour.destination","user"})
    List<Booking> findByUserIdOrderByTourDepartureDate(Long userId);
}
