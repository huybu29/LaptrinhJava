package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.AppointmentDTO;
import project.repo.service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // 🔹 Helper kiểm tra role hợp lệ
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 1. Tạo mới cuộc hẹn (CUSTOMER tạo cho chính mình)
    @PostMapping
    public AppointmentDTO createAppointment(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody AppointmentDTO dto) {

        checkRole(role, "CUSTOMER");
        dto.setCustomerId(userId);
        return appointmentService.create(dto);
    }

    // 🔹 2. Lấy tất cả cuộc hẹn (ADMIN, STAFF)
    @GetMapping
    public List<AppointmentDTO> getAllAppointments(
            @RequestHeader("X-User-Role") String role) {

        checkRole(role, "ADMIN", "STAFF");
        return appointmentService.getAllAppointment();
    }

    // 🔹 3. Lấy cuộc hẹn theo ID (CUSTOMER chỉ xem của mình, STAFF, ADMIN xem tất cả)
    @GetMapping("/{id}")
    public AppointmentDTO getAppointmentById(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        AppointmentDTO appointment = appointmentService.getAppointmentById(id);

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role)) {
            if (!appointment.getCustomerId().equals(userId)) {
                throw new RuntimeException("Access denied: cannot view others' appointments");
            }
        } else {
            checkRole(role, "STAFF", "ADMIN");
        }

        return appointment;
    }

    // 🔹 4. Lấy cuộc hẹn theo vehicleId (STAFF, ADMIN)
    @GetMapping("/vehicle/{vehicleId}")
    public List<AppointmentDTO> getAppointmentsByVehicle(
            @PathVariable Long vehicleId,
            @RequestHeader("X-User-Role") String role) {

        checkRole(role, "STAFF", "ADMIN");
        return appointmentService.getAppointmentByVehicle(vehicleId);
    }

    // 🔹 5. Lấy cuộc hẹn theo customerId (STAFF, ADMIN, CUSTOMER chỉ xem của mình)
    @GetMapping("/customer/{customerId}")
    public List<AppointmentDTO> getAppointmentsByCustomer(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long customerId) {

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !userId.equals(customerId)) {
            throw new RuntimeException("Access denied: cannot view others' appointments");
        }

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return appointmentService.getAppointmentByCustomer(customerId);
    }

    // 🔹 6. Lấy cuộc hẹn của chính người dùng đang đăng nhập
    @GetMapping("/me")
    public List<AppointmentDTO> getMyAppointments(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return appointmentService.getAppointmentByCustomer(userId);
    }

    // 🔹 7. Cập nhật cuộc hẹn (CUSTOMER chỉ sửa của mình, STAFF & ADMIN sửa được tất cả)
    @PutMapping("/{id}")
    public AppointmentDTO updateAppointment(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody AppointmentDTO dto) {

        AppointmentDTO existing = appointmentService.getAppointmentById(id);

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !existing.getCustomerId().equals(userId)) {
            throw new RuntimeException("Access denied: cannot modify others' appointments");
        }

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");

        dto.setId(id);
        dto.setCustomerId(existing.getCustomerId()); // giữ nguyên customerId
        return appointmentService.updateAppointment(dto);
    }

    // 🔹 8. Xóa cuộc hẹn (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public void deleteAppointment(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role) {

        checkRole(role, "ADMIN");
        appointmentService.delete(id);
    }
}

