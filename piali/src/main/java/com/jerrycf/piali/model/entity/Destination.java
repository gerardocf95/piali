package com.jerrycf.piali.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "destination")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "El estado es obligatorio")
    private MexicanState state;

    @PositiveOrZero(message = "La distancia no puede ser negativa")
    private int distanceKmFromCDMX;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @PositiveOrZero(message = "El precio base no puede ser negativo")
    private Double basePrice;

    private Integer featuredOrder;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
