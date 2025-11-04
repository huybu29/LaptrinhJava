package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.repo.dtos.NotificationDTO;
import project.repo.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Gửi thông báo mới (ADMIN, STAFF)
    @PostMapping
    public NotificationDTO createNotification(
            @RequestBody NotificationDTO dto,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return notificationService.sendNotification(dto);
    }

    // 🔹 Lấy tất cả thông báo (ADMIN, STAFF)
    @GetMapping
    public List<NotificationDTO> getAllNotifications(
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return notificationService.getNotificationsByUser(null); // null = lấy tất cả
    }

    // 🔹 Lấy thông báo của chính mình (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/me")
    public List<NotificationDTO> getMyNotifications(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId
    ) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return notificationService.getNotificationsByUser(userId);
    }

    // 🔹 Lấy thông báo của 1 user cụ thể (ADMIN, STAFF)
    @GetMapping("/user/{userId}")
    public List<NotificationDTO> getNotificationsByUser(
            @PathVariable Long userId,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return notificationService.getNotificationsByUser(userId);
    }

    // 🔹 Đánh dấu đã đọc (CUSTOMER, STAFF, ADMIN)
    @PutMapping("/{id}/read")
    public NotificationDTO markAsRead(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return notificationService.markAsRead(id);
    }

    // 🔹 Đếm thông báo chưa đọc (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/count/unread")
    public long countUnread(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId
    ) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return notificationService.countUnread(userId);
    }

    // 🔹 Xóa thông báo (ADMIN, STAFF, hoặc chính chủ)
    @DeleteMapping("/{id}")
    public String deleteNotification(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-User-Id", required = false) Long userId
    ) {
        if (role.equalsIgnoreCase("ROLE_ADMIN") || role.equalsIgnoreCase("ROLE_STAFF")) {
            notificationService.deleteNotification(id);
            return "✅ Notification deleted by admin/staff";
        }

        // CUSTOMER chỉ được xóa thông báo của chính mình
        var myNoti = notificationService.getNotificationsByUser(userId);
        boolean owns = myNoti.stream().anyMatch(n -> n.getId().equals(id));

        if (!owns) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "❌ Bạn không thể xóa thông báo của người khác");
        }

        notificationService.deleteNotification(id);
        return "✅ Notification deleted successfully";
    }



    // 🔹 Kiểm tra API hoạt động
    @GetMapping("/test")
    public String test() {
        return "✅ Notification Service is running!";
    }
}
