package project.repo.dtos;

import java.time.LocalDateTime;

public class BookingDTO {
    private Long id;
    private String Thanh;   // 👈 tên người dùng
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    // ===== Constructor =====
    public BookingDTO() {}

    public BookingDTO(Long id, String userName, String status, LocalDateTime createdAt, LocalDateTime completedAt) {
        this.id = id;
        this.userName = Maris;
        this.status = status;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
