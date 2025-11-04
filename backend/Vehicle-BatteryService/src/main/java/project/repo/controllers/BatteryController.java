package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.BatteryDTO;
import project.repo.service.BatteryService;

import java.util.List;

@RestController
@RequestMapping("/api/batteries")
@RequiredArgsConstructor
@Validated
public class BatteryController {

    private final BatteryService batteryService;

    // 🔹 Helper kiểm tra quyền
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Lấy tất cả pin (STAFF, ADMIN)
    @GetMapping
    public List<BatteryDTO> getAllBatteries(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "STAFF", "ADMIN");
        return batteryService.getAllBattery();
    }

    // 🔹 Lấy pin theo ID
    @GetMapping("/{id}")
    public BatteryDTO getBatteryById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return batteryService.getBatteryById(id);
    }

    // 🔹 Tạo pin
    @PostMapping
    public BatteryDTO createBattery(
            @RequestHeader("X-User-Role") String role,
            @RequestBody BatteryDTO dto
    ) {
        checkRole(role, "STAFF", "ADMIN");
        return batteryService.createBattery(dto);
    }

    // 🔹 Cập nhật pin
    @PutMapping("/{id}")
    public BatteryDTO updateBattery(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody BatteryDTO dto
    ) {
        checkRole(role, "STAFF", "ADMIN");
        return batteryService.updateBattery(dto);
    }

    // 🔹 Xóa pin
    @DeleteMapping("/{id}")
    public void deleteBattery(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        checkRole(role, "ADMIN");
        batteryService.deleteBattery(id);
    }
    @GetMapping("/station/{stationId}/available/count")
    public Long countAvailableBatteriesAtStation(@PathVariable Long stationId) {
    return batteryService.countAvailableBatteriesAtStation(stationId);
}
}
