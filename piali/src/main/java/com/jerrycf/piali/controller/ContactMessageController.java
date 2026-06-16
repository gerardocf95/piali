package com.jerrycf.piali.controller;

import com.jerrycf.piali.model.DTO.contact.ContactMessageRequest;
import com.jerrycf.piali.model.DTO.contact.ContactMessageResponse;
import com.jerrycf.piali.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contact-messages")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    /*****  POST  *****/
    @PostMapping
    public ResponseEntity<ContactMessageResponse> createMessage(@Valid @RequestBody ContactMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactMessageService.createMessage(request));
    }

    /*****  GET  *****/
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactMessageResponse>> getAllMessages() {
        return ResponseEntity.ok(contactMessageService.getAllMessages());
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        return ResponseEntity.ok(Map.of("count", contactMessageService.countUnread()));
    }

    /*****  PATCH  *****/
    @PatchMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactMessageResponse> markAsRead(
            @PathVariable Long id,
            @RequestParam(defaultValue = "true") boolean read) {
        return ResponseEntity.ok(contactMessageService.markAsRead(id, read));
    }

    /*****  DELETE  *****/
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
