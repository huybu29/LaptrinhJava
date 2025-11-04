package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.repo.service.BatterySwapService;
import project.repo.entity.Battery;
import project.repo.dtos.SwapRequest;
import project.repo.dtos.BatterySwapResponse;

import java.util.List;

@RestController
@RequestMapping("/api/battery-swaps")
@RequiredArgsConstructor
@Validated
public class BatterySwapController {

    private final BatterySwapService batterySwapService;

    // 🔹 Helper kiểm tra quyền truy cập
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Đổi pin (STAFF, ADMIN)
    @PostMapping
    public BatterySwapResponse swapBattery(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody SwapRequest request
    ) {
        checkRole(role, "STAFF", "ADMIN");
        return batterySwapService.swapBattery(request);
    }

    // 🔹 Kiểm tra xe có thể đổi pin hay không (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/can-swap/{vehicleId}/{batteryId}")
    public boolean canSwapBattery(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long vehicleId,
            @PathVariable Long batteryId
    ) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return batterySwapService.canSwapBattery(vehicleId, batteryId);
    }

    // 🔹 Lấy pin hiện đang gắn với xe (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/current/{vehicleId}")
    public Battery getCurrentBattery(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long vehicleId
    ) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return batterySwapService.getCurrentBattery(vehicleId);
    }

    // 🔹 (Tùy chọn mở rộng) — Lấy danh sách lịch sử đổi pin của xe
    @GetMapping("/history/{vehicleId}")
    public List<BatterySwapResponse> getSwapHistoryByVehicle(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long vehicleId
    ) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return batterySwapService.getSwapHistoryByVehicle(vehicleId);
    }
}
