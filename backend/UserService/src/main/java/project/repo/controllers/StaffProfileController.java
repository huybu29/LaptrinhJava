package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.entity.StaffProfile;
import project.repo.service.StaffProfileService;

import java.util.List;

@RestController
@RequestMapping("/api/staff-profiles")
@RequiredArgsConstructor
public class StaffProfileController {

    private final StaffProfileService staffProfileService;

    @PostMapping
    public ResponseEntity<StaffProfile> create(@RequestBody StaffProfile profile) {
        return ResponseEntity.ok(staffProfileService.createProfile(profile));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffProfile> getById(@PathVariable Long id) {
        return ResponseEntity.ok(staffProfileService.getProfileById(id));
    }

    @GetMapping
    public ResponseEntity<List<StaffProfile>> getAll() {
        return ResponseEntity.ok(staffProfileService.getAllProfiles());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffProfile> update(@PathVariable Long id, @RequestBody StaffProfile profile) {
        return ResponseEntity.ok(staffProfileService.updateProfile(id, profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        staffProfileService.deleteProfile(id);
        return ResponseEntity.ok("Staff profile deleted successfully");
    }
}
