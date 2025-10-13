package project.repo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với bảng users (User entity)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")  // cột khóa ngoại trong bảng bookings
    private User user;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public Booking() {}

    public Booking(User user, String status, LocalDateTime createdAt, LocalDateTime completedAt) {
        this.user = user;
        this.status = status;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    // ===== GETTER & SETTER =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
