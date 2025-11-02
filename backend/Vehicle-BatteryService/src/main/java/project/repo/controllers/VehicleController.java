package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.repo.dtos.VehicleDTO;
import project.repo.service.VehicleService;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@Validated
public class VehicleController {

    private final VehicleService vehicleService;

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

    // 🔹 Lấy tất cả xe (STAFF, ADMIN)
    @GetMapping
    public List<VehicleDTO> getAllVehicles(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "STAFF", "ADMIN");
        return vehicleService.getAllVehicle();
    }

    // 🔹 Tạo xe mới (CUSTOMER tự thêm xe của mình, STAFF/ADMIN thêm cho người khác)
    @PostMapping
    public VehicleDTO createVehicle(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestBody VehicleDTO vehicleDTO
    ) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thiếu header X-User-Id");
        }

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role)) {
            vehicleDTO.setOwnerId(userId);
        } else {
            checkRole(role, "ADMIN", "STAFF");
        }

        return vehicleService.createVehicle(vehicleDTO);
    }

    // 🔹 Lấy xe theo ID (CUSTOMER chỉ xem xe của mình)
    @GetMapping("/{id}")
    public VehicleDTO getVehicleById(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thiếu header X-User-Id");
        }

        VehicleDTO vehicle = vehicleService.getVehicleById(id);
        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !vehicle.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không được phép xem xe của người khác");
        }
        return vehicle;
    }

    // 🔹 Lấy xe của chính mình (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/me")
    public List<VehicleDTO> getMyVehicles(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thiếu header X-User-Id");
        }
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return vehicleService.getVehicleByUserId(userId);
    }

    // 🔹 Cập nhật xe (STAFF, ADMIN)
    @PutMapping("/{id}")
    public VehicleDTO updateVehicleById(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody VehicleDTO dto
    ) {
        checkRole(role, "STAFF", "ADMIN");
        return vehicleService.updateVehicleById(id, dto);
    }

    // 🔹 Xóa xe (ADMIN)
    @DeleteMapping("/{id}")
    public void deleteVehicle(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        checkRole(role, "ADMIN");
        vehicleService.deleteVehicle(id);
    }

    // 🔹 Lấy xe theo VIN (STAFF, ADMIN)
    @GetMapping("/vin/{vin}")
    public VehicleDTO getVehicleByVin(
            @RequestHeader("X-User-Role") String role,
            @PathVariable String vin
    ) {
        checkRole(role, "STAFF", "ADMIN");
        return vehicleService.getVehicleByVin(vin);
    }

    // 🔹 Test nhận header từ Gateway
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
        return "✅ Nhận được header từ Gateway — userId=" + userId + ", role=" + role;
    }
}