package project.repo.controllers;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.service.BatterySwapService;
import project.repo.entity.Battery;
import project.repo.dtos.SwapRequest;
import project.repo.dtos.BatterySwapResponse;

@RestController
@RequestMapping("/api/battery-swap")
@RequiredArgsConstructor
public class BatterySwapController {
 private final BatterySwapService batterySwapService;
    
    @PostMapping
    public BatterySwapResponse swapBattery(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody SwapRequest request) {
        
        // Chỉ STAFF và ADMIN được phép đổi pin
        checkRole(role, "STAFF", "ADMIN");
        
        return batterySwapService.swapBattery(request);
    }
    
    @GetMapping("/can-swap/{vehicleId}/{batteryId}")
    public boolean canSwapBattery(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long vehicleId,
            @PathVariable Long batteryId) {
        
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return batterySwapService.canSwapBattery(vehicleId, batteryId);
    }
    
    @GetMapping("/current/{vehicleId}")
    public Battery getCurrentBattery(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long vehicleId) {
        
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return batterySwapService.getCurrentBattery(vehicleId);
    }
    
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }
}
