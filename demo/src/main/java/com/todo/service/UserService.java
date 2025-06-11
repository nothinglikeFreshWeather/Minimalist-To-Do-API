package com.todo.service;

import com.todo.entity.User;
import com.todo.repository.UserRepository;
import com.todo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Kullanıcı kaydı
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    
    // Kullanıcı girişi
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameAndActive(request.getUsername(), true)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        return new LoginResponse(true, "Login successful", null);
    }
    
    // Kullanıcının mevcut profilini al
    public UserResponse getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsernameAndActive(username, true)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToUserResponse(user);
    }
    
    // Kullanıcı profil güncelleme
    public UserResponse updateProfile(UpdateProfileRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsernameAndActive(username, true)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        User updatedUser = userRepository.save(user);
        return convertToUserResponse(updatedUser);
    }
    
    // Şifre değiştirme
    public void changePassword(ChangePasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsernameAndActive(username, true)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    // Entity'yi Response'a çevir
    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}