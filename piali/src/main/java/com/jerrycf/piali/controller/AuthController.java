package com.jerrycf.piali.controller;

import com.jerrycf.piali.model.DTO.users.AuthResponse;
import com.jerrycf.piali.model.DTO.users.LoginRequest;
import com.jerrycf.piali.model.DTO.users.RefreshRequest;
import com.jerrycf.piali.model.DTO.users.RegisterRequest;
import com.jerrycf.piali.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Wtih JWT stateless, logout is handle by client deleting the token, if needed to invalidate tokens on server,
        // it will be needed a blacklist from Redis
        return ResponseEntity.noContent().build();
    }
}
