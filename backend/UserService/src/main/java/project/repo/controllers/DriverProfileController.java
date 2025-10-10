package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.entity.DriverProfile;
import project.repo.service.DriverProfileService;

import java.util.List;

@RestController
@RequestMapping("/api/driver-profiles")
@RequiredArgsConstructor
public class DriverProfileController {

    private final DriverProfileService driverProfileService;

    @PostMapping
    public ResponseEntity<DriverProfile> create(@RequestBody DriverProfile profile) {
        return ResponseEntity.ok(driverProfileService.createProfile(profile));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverProfile> getById(@PathVariable Long id) {
        return ResponseEntity.ok(driverProfileService.getProfileById(id));
    }

    @GetMapping
    public ResponseEntity<List<DriverProfile>> getAll() {
        return ResponseEntity.ok(driverProfileService.getAllProfiles());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DriverProfile> update(@PathVariable Long id, @RequestBody DriverProfile profile) {
        return ResponseEntity.ok(driverProfileService.updateProfile(id, profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        driverProfileService.deleteProfile(id);
        return ResponseEntity.ok("Driver profile deleted successfully");
    }
}
