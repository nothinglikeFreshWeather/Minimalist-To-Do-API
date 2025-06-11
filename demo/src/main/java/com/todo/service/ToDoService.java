package com.todo.service;

import com.todo.entity.Todo;
import com.todo.entity.User;
import com.todo.repository.TodoRepository;
import com.todo.repository.UserRepository;
import com.todo.dto.ToDoCreateRequest;
import com.todo.dto.ToDoUpdateRequest;
import com.todo.dto.ToDoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ToDoService {
    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private UserRepository userRepository;

    // Kullanıcının tüm todo'larını getir
    public List<ToDoResponse> getAllTodos(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return todoRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Yeni todo oluştur
    public ToDoResponse createTodo(ToDoCreateRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(false);
        todo.setUser(user);
        Todo saved = todoRepository.save(todo);
        return convertToResponse(saved);
    }

    // Todo güncelle
    public Optional<ToDoResponse> updateTodo(Long id, ToDoUpdateRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Optional<Todo> optionalTodo = todoRepository.findById(id);
        if (optionalTodo.isPresent() && optionalTodo.get().getUser().equals(user)) {
            Todo todo = optionalTodo.get();
            if (request.getTitle() != null) todo.setTitle(request.getTitle());
            if (request.getDescription() != null) todo.setDescription(request.getDescription());
            if (request.getCompleted() != null) todo.setCompleted(request.getCompleted());
            Todo updated = todoRepository.save(todo);
            return Optional.of(convertToResponse(updated));
        }
        return Optional.empty();
    }

    // Todo sil
    public boolean deleteTodo(Long id, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Optional<Todo> optionalTodo = todoRepository.findById(id);
        if (optionalTodo.isPresent() && optionalTodo.get().getUser().equals(user)) {
            todoRepository.delete(optionalTodo.get());
            return true;
        }
        return false;
    }

    // Entity'yi Response'a çevir
    private ToDoResponse convertToResponse(Todo todo) {
        return new ToDoResponse(
            todo.getId(),
            todo.getTitle(),
            todo.getDescription(),
            todo.isCompleted()
        );
    }
}