package com.todo.repository;

import com.todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Username ile kullanıcı bul
    Optional<User> findByUsername(String username);
    
    // Email ile kullanıcı bul
    Optional<User> findByEmail(String email);
    
    // Aktif kullanıcı bul
    Optional<User> findByUsernameAndActive(String username, Boolean active);
    
    // Username var mı kontrol et
    boolean existsByUsername(String username);
    
    // Email var mı kontrol et
    boolean existsByEmail(String email);
}