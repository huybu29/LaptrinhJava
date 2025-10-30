package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.repo.dtos.StationDTO;
import project.repo.entity.Station;
import project.repo.mapper.StationMapper;
import project.repo.service.StationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService stationService;
    private final StationMapper stationMapper;

    // 🔹 Helper kiểm tra role (giống các controller khác)
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Lấy tất cả trạm sạc (ADMIN, STAFF)
    @GetMapping
    public List<StationDTO> getAllStations(
            @RequestHeader("X-User-Role") String role
    ) {
        
        return stationService.getAllStations()
                .stream()
                .map(stationMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 🔹 Lấy thông tin trạm theo ID (ADMIN, STAFF, CUSTOMER)
    @GetMapping("/{id}")
    public StationDTO getStationById(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF", "CUSTOMER");
        return stationService.getStationById(id)
                .map(stationMapper::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Station not found"));
    }

    // 🔹 Tạo trạm mới (chỉ ADMIN)
    @PostMapping
    public StationDTO createStation(
            @RequestBody StationDTO stationDTO,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN");
        Station station = stationMapper.toEntity(stationDTO);
        return stationMapper.toDTO(stationService.createStation(station));
    }

    // 🔹 Cập nhật trạm (ADMIN, STAFF)
    @PutMapping("/{id}")
    public StationDTO updateStation(
            @PathVariable Long id,
            @RequestBody StationDTO stationDTO,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        Station updated = stationMapper.toEntity(stationDTO);
        return stationMapper.toDTO(stationService.updateStation(id, updated));
    }

    // 🔹 Xóa trạm (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStation(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN");
        stationService.deleteStation(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Lấy tổng số pin của tất cả trạm (ADMIN, STAFF)
    @GetMapping("/pin-count")
    public ResponseEntity<Integer> getTotalPinCount(
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        int total = stationService.getTotalPinCount();
        return ResponseEntity.ok(total);
    }

    // 🔹 Lấy số pin còn lại của một trạm (ADMIN, STAFF, CUSTOMER)
    @GetMapping("/{id}/pin-count")
    public ResponseEntity<Integer> getPinCount(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF", "CUSTOMER");
        int count = stationService.getPinCountById(id);
        return ResponseEntity.ok(count);
    }

    // 🔹 Cập nhật số pin của trạm (ADMIN, STAFF)
    @PutMapping("/{id}/pin-count")
    public ResponseEntity<StationDTO> updatePinCount(
            @PathVariable Long id,
            @RequestParam int newCount,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        Station updated = stationService.updatePinCount(id, newCount);
        return ResponseEntity.ok(stationMapper.toDTO(updated));
    }

    // 🔹 Endpoint kiểm tra trạng thái server
    @GetMapping("/test")
    public String test() {
        return "✅ Station Service is running!";
    }
}
