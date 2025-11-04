package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

  
    private Long userId;

    private String title;

    @Column(length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;


    @Enumerated(EnumType.STRING)
    private NotificationPriority priority;

  
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;


    private LocalDateTime createdAt;

    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = NotificationStatus.UNREAD;
        if (priority == null) priority = NotificationPriority.NORMAL;
    }

  
    public enum NotificationStatus { READ, UNREAD }
    public enum NotificationPriority { LOW, NORMAL, HIGH, CRITICAL }
    public enum NotificationType { SYSTEM, BATTERY, BOOKING, PAYMENT, VEHICLE }
}
