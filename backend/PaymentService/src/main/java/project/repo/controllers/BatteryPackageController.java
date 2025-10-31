package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.repo.dtos.BatteryPackageDTO;
import project.repo.service.BatteryPackageService;

import java.util.List;

@RestController
@RequestMapping("/api/battery-packages")
@RequiredArgsConstructor
@Validated
public class BatteryPackageController {

    private final BatteryPackageService batteryPackageService;

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

    // 🔹 Lấy tất cả gói thuê pin (STAFF, ADMIN)
    @GetMapping
    public List<BatteryPackageDTO> getAllPackages(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "STAFF", "ADMIN");
        return batteryPackageService.getAllPackages();
    }

    // 🔹 Lấy các gói của người dùng hiện tại (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/me")
    public List<BatteryPackageDTO> getMyPackages(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thiếu header X-User-Id");
        }
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return batteryPackageService.getPackagesByUser(userId);
    }

    // 🔹 Lấy chi tiết 1 gói thuê pin theo ID (CUSTOMER chỉ được xem gói của mình)
    @GetMapping("/{id}")
    public BatteryPackageDTO getPackageById(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        BatteryPackageDTO pkg = batteryPackageService.getPackageById(id);
        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !pkg.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không được phép xem gói của người khác");
        }
        return pkg;
    }

    // 🔹 Đăng ký gói thuê pin (CUSTOMER)
    @PostMapping
    public BatteryPackageDTO createPackage(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody BatteryPackageDTO dto
    ) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thiếu header X-User-Id");
        }
        checkRole(role, "CUSTOMER", "ADMIN");

        dto.setUserId(userId);
        return batteryPackageService.createPackage(dto);
    }

    // 🔹 Cập nhật thông tin gói (STAFF, ADMIN)
    @PutMapping("/{id}")
    public BatteryPackageDTO updatePackage(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody BatteryPackageDTO dto
    ) {
        checkRole(role, "STAFF", "ADMIN");
        return batteryPackageService.updatePackage(id, dto);
    }

    // 🔹 Hủy gói thuê pin (CUSTOMER chỉ được hủy gói của mình)
    @DeleteMapping("/{id}")
    public void deletePackage(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        BatteryPackageDTO pkg = batteryPackageService.getPackageById(id);
        if ("ROLE_CUSTOMER".equalsIgnoreCase(role)) {
            if (!pkg.getUserId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không được phép hủy gói của người khác");
            }
        } else {
            checkRole(role, "ADMIN"); // chỉ ADMIN có thể xóa toàn bộ gói
        }

        batteryPackageService.deletePackage(id);
    }

    // 🔹 Test nhận header từ API Gateway
    @GetMapping("/test")
    public String testHeaders(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestHeader(value = "X-User-Role", required = false) String role
    ) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "❌ Thiếu header: X-User-Id từ Gateway");
        }
        if (role == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "❌ Thiếu header: X-User-Role từ Gateway");
        }
        return "✅ BatteryPackageController: Nhận được header — userId=" + userId + ", role=" + role;
    }
}
