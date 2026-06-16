package com.jerrycf.piali.model.DTO.contact;

import com.jerrycf.piali.model.entity.ContactMessage;

import java.time.LocalDateTime;

public record ContactMessageResponse(

        Long id,
        String name,
        String email,
        String phone,
        String message,
        boolean read,
        LocalDateTime createdAt
) {

    public static ContactMessageResponse from(ContactMessage m) {
        return new ContactMessageResponse(
                m.getId(),
                m.getName(),
                m.getEmail(),
                m.getPhone(),
                m.getMessage(),
                m.isRead(),
                m.getCreatedAt()
        );
    }
}
