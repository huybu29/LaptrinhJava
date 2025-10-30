package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.repo.dtos.NotificationDTO;
import project.repo.service.NotificationService;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        if (roleHeader == null || roleHeader.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thiếu header X-User-Role");
        }
        for (String role : allowedRoles) {
            if (roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Truy cập bị từ chối: yêu cầu quyền " + String.join(", ", allowedRoles));
    }

    // 🔹 Tạo thông báo (ADMIN, STAFF)
    @PostMapping
    public NotificationDTO createNotification(
            @RequestHeader("X-User-Role") String role,
            @RequestBody NotificationDTO dto
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return notificationService.createNotification(dto);
    }

    // 🔹 Cập nhật thông báo (ADMIN, STAFF)
    @PutMapping("/{id}")
    public NotificationDTO updateNotification(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody NotificationDTO dto
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return notificationService.updateNotification(id, dto);
    }

    // 🔹 Xóa thông báo (ADMIN)
    @DeleteMapping("/{id}")
    public void deleteNotification(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        checkRole(role, "ADMIN");
        notificationService.deleteNotification(id);
    }

    // 🔹 Lấy tất cả thông báo (STAFF, ADMIN)
    @GetMapping
    public List<NotificationDTO> getAllNotifications(
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "STAFF", "ADMIN");
        return notificationService.getAllNotifications();
    }

    // 🔹 Lấy thông báo theo loại nhận (STAFF, ADMIN)
    @GetMapping("/receiver/{type}")
    public List<NotificationDTO> getNotificationsByReceiver(
            @RequestHeader("X-User-Role") String role,
            @PathVariable String type
    ) {
        checkRole(role, "STAFF", "ADMIN");
        return notificationService.getNotificationsByReceiver(type.toUpperCase());
    }
}
