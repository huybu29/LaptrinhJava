package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.ProfileDTO;
import project.repo.entity.AppUser;
import project.repo.repository.AppUserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final AppUserRepository userRepository;

    // Lấy danh sách tất cả tài khoản (Admin có thể quản lý)
    @GetMapping
    public ResponseEntity<List<ProfileDTO>> getAllUsers() {
        List<ProfileDTO> users = userRepository.findAll()
                .stream()
                .map(ProfileDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Lấy hồ sơ theo username
    @GetMapping("/{username}")
    public ResponseEntity<ProfileDTO> getUserByUsername(@PathVariable String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(ProfileDTO.fromEntity(user));
    }

    // Cập nhật hồ sơ
    @PutMapping("/{username}")
    public ResponseEntity<ProfileDTO> updateProfile(@PathVariable String username,
                                                    @RequestBody ProfileDTO request) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole()); // chỉ Admin mới được chỉnh role

        userRepository.save(user);
        return ResponseEntity.ok(ProfileDTO.fromEntity(user));
    }
}
