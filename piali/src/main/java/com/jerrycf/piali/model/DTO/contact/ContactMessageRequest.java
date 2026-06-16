package com.jerrycf.piali.model.DTO.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactMessageRequest(

        @NotBlank(message = "El nombre es obligatorio")
        String name,

        @Email(message = "El correo no es válido")
        String email,

        String phone,

        @NotBlank(message = "El mensaje es obligatorio")
        String message
) { }
