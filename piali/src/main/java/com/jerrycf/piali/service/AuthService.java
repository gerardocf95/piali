package com.jerrycf.piali.service;

import com.jerrycf.piali.exception.EmailAlreadyExistsException;
import com.jerrycf.piali.model.DTO.users.AuthResponse;
import com.jerrycf.piali.model.DTO.users.LoginRequest;
import com.jerrycf.piali.model.DTO.users.RegisterRequest;
import com.jerrycf.piali.model.entity.User;
import com.jerrycf.piali.repository.UserRepository;
import com.jerrycf.piali.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        userRepository.save(user);

        return buildTokens(user);
    }

    public AuthResponse login(LoginRequest request) {
        //Already throws exception if wrong credentials
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email()).orElseThrow();
        return buildTokens(user);
    }

    public AuthResponse refresh(String refreshToken) {
        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email).orElseThrow();
        if (!jwtService.isTokenValid(refreshToken, user)){
            throw new BadCredentialsException("Refresh Token invalid or expired");
        }

        return buildTokens(user);
    }

    public AuthResponse buildTokens(User user) {
        return new AuthResponse(jwtService.generateAccessToken(user), jwtService.generateRefreshToken(user));
    }
}
