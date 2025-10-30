package project.repo.service;

import project.repo.dtos.NotificationDTO;
import java.util.List;

public interface NotificationService {
    NotificationDTO createNotification(NotificationDTO dto);
    NotificationDTO updateNotification(Long id, NotificationDTO dto);
    void deleteNotification(Long id);
    List<NotificationDTO> getAllNotifications();
    List<NotificationDTO> getNotificationsByReceiver(String receiverType);
}
