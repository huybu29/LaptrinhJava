package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.NotificationDTO;
import project.repo.entity.Notification;
import project.repo.mapper.NotificationMapper;
import project.repo.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    // Tạo thông báo mới
    public NotificationDTO sendNotification(NotificationDTO dto) {
        Notification entity = notificationMapper.toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setStatus(Notification.NotificationStatus.UNREAD);

        return notificationMapper.toDTO(notificationRepository.save(entity));
    }

    // Lấy danh sách thông báo của user
    public List<NotificationDTO> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Đánh dấu thông báo là đã đọc
    @Transactional
    public NotificationDTO markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setStatus(Notification.NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());

        return notificationMapper.toDTO(notificationRepository.save(notification));
    }

    // Đếm thông báo chưa đọc
    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndStatus(userId, Notification.NotificationStatus.UNREAD);
    }
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    public void deleteAllNotificationsForUser(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notificationRepository.deleteAll(notifications);
    }
}
