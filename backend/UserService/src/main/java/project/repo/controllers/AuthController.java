package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.AuthRequest;
import project.repo.dtos.AuthResponse;
import project.repo.entity.AppUser;
import project.repo.repository.AppUserRepository;
import project.repo.service.JwtService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    // 🔹 Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("❌ Username already taken");
        }

        AppUser user = AppUser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword())) // BCrypt
                .role("ROLE_USER")
                .email(request.getEmail())
                .phone(request.getPhone())
                .fullName(request.getFullName())
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("✅ User registered successfully");
    }

    // 🔹 Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AppUser user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid credentials");
            }

            String token = jwtService.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("⚠️ Login failed: " + e.getMessage());
        }
    }

    // 🔹 Đăng xuất (thực tế chỉ là clear token bên client)
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("✅ Logout successful (clear token on client)");
    }
}
