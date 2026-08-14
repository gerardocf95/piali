package com.jerrycf.piali.service;

import com.jerrycf.piali.model.DTO.booking.BookingRequest;
import com.jerrycf.piali.model.entity.*;
import com.jerrycf.piali.repository.BookingRepository;
import com.jerrycf.piali.repository.DestinationRepository;
import com.jerrycf.piali.repository.TourRepository;
import com.jerrycf.piali.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test de concurrencia para la sobreventa de cupo (currentTravelers).
 *
 * <p>Lanza N reservas en paralelo contra un tour con cupo limitado. Con el código
 * actual (read-modify-write sin bloqueo) varias transacciones leen el mismo
 * {@code currentTravelers}, todas pasan la validación de cupo y todas insertan su
 * reserva → se reservan MÁS personas que el cupo. Por eso este test
 * <b>está pensado para FALLAR hoy</b>.
 *
 * <p>Cuando implementes una de las estrategias (lock optimista con {@code @Version},
 * lock pesimista, o UPDATE atómico condicional), el invariante
 * "personas reservadas ≤ cupo" se respetará y el test pasará sin tocarlo.
 *
 * <p>Requiere Docker corriendo (PostgreSQL vía Testcontainers).
 */
@SpringBootTest
class BookingConcurrencyTest {

    @Autowired
    private BookingService bookingService;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private TourRepository tourRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DestinationRepository destinationRepository;

    private static final int CAPACITY = 10;   // cupo del tour
    private static final int THREADS = 20;     // demanda: 20 personas (1 c/u) contra 10 lugares

    private Long tourId;
    private User user;

    @BeforeEach
    void setUp() {
        // Limpieza respetando las FKs (booking → tour → destination; user al final).
        bookingRepository.deleteAll();
        tourRepository.deleteAll();
        destinationRepository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setEmail("tester+" + UUID.randomUUID() + "@piali.mx");
        user.setPassword("irrelevante-para-el-test");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole(Role.USER);
        user = userRepository.save(user);

        Destination destination = new Destination();
        destination.setName("Destino de prueba");
        destination.setState(MexicanState.CIUDAD_DE_MEXICO);
        destination.setDistanceKmFromCDMX(0);
        destination.setBasePrice(500.0);
        destination = destinationRepository.save(destination);

        Tour tour = new Tour();
        tour.setDestination(destination);
        tour.setName("Tour de prueba");
        tour.setTourType(TourType.AVENTURA);
        tour.setDifficultyLevel(DifficultyLevel.FACIL);
        tour.setAdultPrice(new BigDecimal("100.00"));
        tour.setChildPrice(new BigDecimal("50.00"));
        tour.setDurationDays(1);
        tour.setMinGroupSize(1);
        tour.setMaxGroupSize(CAPACITY);
        tour.setCurrentTravelers(0);
        tour.setDeparturePoint("CDMX");
        tour.setTransportType(TransportType.VAN);
        tour.setDepartureDate(LocalDateTime.now().plusDays(30)); // futura: pasa la validación
        tour.setAvailable(true);
        tour.setFeatured(false);
        tour = tourRepository.save(tour);

        tourId = tour.getId();
    }

    @Test
    void concurrentBookings_shouldNotOversellTour() throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(THREADS);
        CountDownLatch ready = new CountDownLatch(THREADS); // todos listos
        CountDownLatch start = new CountDownLatch(1);       // disparo simultáneo
        CountDownLatch done = new CountDownLatch(THREADS);  // todos terminaron
        AtomicInteger booked = new AtomicInteger();
        AtomicInteger rejected = new AtomicInteger();

        for (int i = 0; i < THREADS; i++) {
            pool.submit(() -> {
                ready.countDown();
                try {
                    start.await(); // todos arrancan a la vez para maximizar la carrera
                    bookingService.createBooking(
                            new BookingRequest(tourId, 1, 0, PaymentMethod.CASH_ON_SITE, null),
                            user);
                    booked.incrementAndGet();
                } catch (Exception e) {
                    // Rechazo esperado: sin cupo (InvalidBookingException) o conflicto de lock.
                    rejected.incrementAndGet();
                } finally {
                    done.countDown();
                }
            });
        }

        ready.await();
        start.countDown();
        assertThat(done.await(30, TimeUnit.SECONDS))
                .as("Las reservas concurrentes no terminaron a tiempo")
                .isTrue();
        pool.shutdownNow();

        // La verdad está en las reservas persistidas: nunca debe haber más personas que el cupo.
        int peopleBooked = bookingRepository.findAll().stream()
                .mapToInt(b -> b.getAdults() + b.getChildren())
                .sum();

        System.out.printf(
                "Concurrencia → reservas OK=%d, rechazadas=%d, personas reservadas=%d, cupo=%d%n",
                booked.get(), rejected.get(), peopleBooked, CAPACITY);

        assertThat(peopleBooked)
                .as("SOBREVENTA: se reservaron %d personas para un cupo de %d", peopleBooked, CAPACITY)
                .isLessThanOrEqualTo(CAPACITY);

        Tour reloaded = tourRepository.findById(tourId).orElseThrow();
        assertThat(reloaded.getCurrentTravelers())
                .as("El contador currentTravelers del tour superó el cupo")
                .isLessThanOrEqualTo(CAPACITY);
    }
}
