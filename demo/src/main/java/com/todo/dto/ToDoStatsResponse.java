// ToDoStatsResponse.java
package com.todo.dto;

public class ToDoStatsResponse {
    
    private long totalTodos;
    private long completedTodos;
    private long pendingTodos;
    
    // Constructors
    public ToDoStatsResponse() {}
    
    public ToDoStatsResponse(long totalTodos, long completedTodos, long pendingTodos) {
        this.totalTodos = totalTodos;
        this.completedTodos = completedTodos;
        this.pendingTodos = pendingTodos;
    }
    
    // Getters and Setters
    public long getTotalTodos() {
        return totalTodos;
    }
    
    public void setTotalTodos(long totalTodos) {
        this.totalTodos = totalTodos;
    }
    
    public long getCompletedTodos() {
        return completedTodos;
    }
    
    public void setCompletedTodos(long completedTodos) {
        this.completedTodos = completedTodos;
    }
    
    public long getPendingTodos() {
        return pendingTodos;
    }
    
    public void setPendingTodos(long pendingTodos) {
        this.pendingTodos = pendingTodos;
    }
}