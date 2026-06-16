package com.jerrycf.piali.service;

import com.jerrycf.piali.exception.ResourceNotFoundException;
import com.jerrycf.piali.model.DTO.contact.ContactMessageRequest;
import com.jerrycf.piali.model.DTO.contact.ContactMessageResponse;
import com.jerrycf.piali.model.entity.ContactMessage;
import com.jerrycf.piali.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    /*****  POST  *****/
    public ContactMessageResponse createMessage(ContactMessageRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name());
        message.setEmail(request.email());
        message.setPhone(request.phone());
        message.setMessage(request.message());

        return ContactMessageResponse.from(contactMessageRepository.save(message));
    }

    /*****  GET  *****/
    public List<ContactMessageResponse> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ContactMessageResponse::from)
                .toList();
    }

    public long countUnread() {
        return contactMessageRepository.countByReadFalse();
    }

    /*****  PATCH  *****/
    public ContactMessageResponse markAsRead(Long id, boolean read) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensaje con id " + id + " no encontrado"));

        message.setRead(read);
        return ContactMessageResponse.from(contactMessageRepository.save(message));
    }

    /*****  DELETE  *****/
    public void deleteMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mensaje con id " + id + " no encontrado para eliminar");
        }
        contactMessageRepository.deleteById(id);
    }
}
