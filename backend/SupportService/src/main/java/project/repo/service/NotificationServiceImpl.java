package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.dtos.NotificationDTO;
import project.repo.entity.Notification;
import project.repo.repository.NotificationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public NotificationDTO createNotification(NotificationDTO dto) {
        Notification n = Notification.builder()
                .title(dto.getTitle())
                .message(dto.getMessage())
                .receiverType(dto.getReceiverType())
                .build();
        notificationRepository.save(n);
        dto.setId(n.getId());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    @Override
    public NotificationDTO updateNotification(Long id, NotificationDTO dto) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setTitle(dto.getTitle());
        n.setMessage(dto.getMessage());
        n.setReceiverType(dto.getReceiverType());
        n.setReadStatus(dto.isReadStatus());
        notificationRepository.save(n);
        return dto;
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getNotificationsByReceiver(String receiverType) {
        return notificationRepository.findByReceiverType(receiverType).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .receiverType(n.getReceiverType())
                .readStatus(n.isReadStatus())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
