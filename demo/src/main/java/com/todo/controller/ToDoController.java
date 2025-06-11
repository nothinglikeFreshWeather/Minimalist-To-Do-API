package com.todo.controller;

import com.todo.service.ToDoService;
import com.todo.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class ToDoController {
    
    @Autowired
    private ToDoService toDoService;
    
    // Kullanıcının tüm todo'larını getir
    @GetMapping
    public ResponseEntity<List<ToDoResponse>> getAllTodos() {
        String userId = getCurrentUserId();
        List<ToDoResponse> todos = toDoService.getAllTodos(userId);
        return ResponseEntity.ok(todos);
    }
    
    // Yeni todo oluştur
    @PostMapping
    public ResponseEntity<ToDoResponse> createTodo(@Valid @RequestBody ToDoCreateRequest request) {
        String userId = getCurrentUserId();
        ToDoResponse createdTodo = toDoService.createTodo(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }
    
    // Todo güncelle
    @PutMapping("/{id}")
    public ResponseEntity<ToDoResponse> updateTodo(@PathVariable Long id, @Valid @RequestBody ToDoUpdateRequest request) {
        String userId = getCurrentUserId();
        Optional<ToDoResponse> updatedTodo = toDoService.updateTodo(id, request, userId);
        return updatedTodo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Todo sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        String userId = getCurrentUserId();
        boolean deleted = toDoService.deleteTodo(id, userId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // JWT token'dan user ID'yi çıkar
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // JWT'den gelen username/userId
    }
}