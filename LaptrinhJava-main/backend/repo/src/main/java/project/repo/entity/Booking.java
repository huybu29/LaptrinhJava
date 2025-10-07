package project.repo.entity;

import java.time.LocalDateTime;

public class Booking {
    private Long id;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public Booking() {}

    public Booking(Long id, String status, LocalDateTime createdAt, LocalDateTime completedAt) {
        this.id = id;
        this.status = status;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
