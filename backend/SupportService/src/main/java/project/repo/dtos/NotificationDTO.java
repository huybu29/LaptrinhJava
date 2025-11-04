package project.repo.dtos;

import lombok.*;
import java.time.LocalDateTime;
import project.repo.entity.Notification.NotificationStatus;
import project.repo.entity.Notification.NotificationPriority;
import project.repo.entity.Notification.NotificationType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationPriority priority;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
