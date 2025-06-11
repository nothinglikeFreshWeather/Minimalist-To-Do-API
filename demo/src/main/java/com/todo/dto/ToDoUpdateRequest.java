// ToDoUpdateRequest.java
package com.todo.dto;

import jakarta.validation.constraints.Size;

public class ToDoUpdateRequest {
    
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    private Boolean completed;
    
    // Constructors
    public ToDoUpdateRequest() {}
    
    public ToDoUpdateRequest(String title, String description, Boolean completed) {
        this.title = title;
        this.description = description;
        this.completed = completed;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Boolean getCompleted() {
        return completed;
    }
    
    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}