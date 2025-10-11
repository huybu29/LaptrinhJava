package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.VehicleDTO;
import project.repo.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // Thêm xe cho driver
    @PostMapping
    public ResponseEntity<VehicleDTO> addVehicle(@RequestBody VehicleDTO vehicleDTO) {
        VehicleDTO savedVehicle = vehicleService.addVehicle(vehicleDTO);
        return ResponseEntity.ok(savedVehicle);
    }

    // Lấy danh sách xe của driver
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<VehicleDTO>> getVehicles(@PathVariable Long driverId) {
        List<VehicleDTO> vehicles = vehicleService.getVehiclesByDriver(driverId);
        return ResponseEntity.ok(vehicles);
    }
}
