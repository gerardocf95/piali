package com.jerrycf.piali.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tour")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Destination
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destination_id", nullable = false)
    @NotNull(message = "El destino es obligatorio")
    private Destination destination;

    // Información general
    @Column(nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "El tipo de tour es obligatorio")
    private TourType tourType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "El nivel de dificultad es obligatorio")
    private DifficultyLevel difficultyLevel; // FACIL(no requiere condición particular), MODERADO(preferible condicion para terrenos un poco complicados), DIFÍCIL(indispensable buena condición para actividades extremas)

    // Precios
    @Column(nullable = false, precision = 10, scale = 2)
    @Positive(message = "El precio por persona debe ser mayor a cero")
    private BigDecimal adultPrice;

    @PositiveOrZero(message = "El precio para niños no puede ser negativo")
    @Column(precision = 10, scale = 2)
    private BigDecimal childPrice; // null = mismo precio que un adulto

    // Logística
    @Column(nullable = false)
    @PositiveOrZero(message = "La duración no puede ser negativa")
    private Integer durationDays;

    @PositiveOrZero(message = "Las noches deben ser mayor a cero")
    private Integer nights; // null = tour de un día (sin hospedaje)

    @Column(nullable = false)
    @Positive(message = "La capacidad mínima debe ser mayor a cero")
    private Integer minGroupSize;

    @Column(nullable = false)
    @Positive(message = "La capacidad máxima debe ser mayor a cero")
    private Integer maxGroupSize;

    @Column(name = "travelers", nullable = false)
    @PositiveOrZero
    private Integer currentTravelers = 0;

    // Logística de salida
    @Column(nullable = false)
    @NotBlank(message = "El punto de salida es obligatorio")
    private String departurePoint;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransportType transportType;

    @Future(message = "La fecha de salida debe ser posterior a hoy")
    private LocalDateTime departureDate;

    // Inclusiones
    @Column(columnDefinition = "TEXT")
    private String includes;

    @Column(columnDefinition = "TEXT")
    private String notIncludes;

    @Column(columnDefinition = "TEXT")
    private String itinerary;

    // Disponibilidad
    @Column(nullable = false)
    private Boolean available = true;

    @Column(nullable = false)
    private Boolean featured = false;

    // Auditoría
    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /*@PrePersist
    protected void onCreate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }*/




}
