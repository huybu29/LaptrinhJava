package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.UserDTO;
import project.repo.entity.User;
import project.repo.mapper.UserMapper;
import project.repo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder; // Inject encoder

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Lấy tất cả người dùng (chỉ ADMIN)
    @GetMapping
    public List<UserDTO> getAllUsers(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "ADMIN");
        return userService.getAllUsers();
    }

    // 🔹 Lấy người dùng theo ID (ADMIN xem tất cả, CUSTOMER/STAFF chỉ xem chính mình)
    @GetMapping("/{id}")
    public UserDTO getUserById(
            @RequestHeader("X-User-Id") Long currentUserId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) || "ROLE_STAFF".equalsIgnoreCase(role)) {
            if (!currentUserId.equals(id)) {
                throw new RuntimeException("Access denied: cannot view other users' info");
            }
        } else {
            checkRole(role, "ADMIN");
        }

        return userService.getUserById(id);
    }

    // 🔹 Tạo người dùng mới (chỉ ADMIN)
    @PostMapping
    public UserDTO createUser(
            @RequestHeader("X-User-Role") String role,
            @RequestBody UserDTO dto) {

        checkRole(role, "ADMIN");
        // Mã hóa mật khẩu trước khi gửi vào service
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        return userService.createUser(dto);
    }

    // 🔹 Cập nhật người dùng (chỉ ADMIN)
    @PutMapping("/{id}")
    public UserDTO updateUser(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody UserDTO dto) {

        checkRole(role, "ADMIN");
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword())); // mã hóa nếu có
        }
        return userService.updateUser(id, dto);
    }

    // 🔹 Xóa người dùng (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public void deleteUser(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id) {

        checkRole(role, "ADMIN");
        userService.deleteUser(id);
    }

    // 🔹 Lấy profile của chính mình (mọi role)
    @GetMapping("/me")
    public UserDTO profile(@RequestHeader("X-User-Id") Long currentUserId) {
        return userService.getUserById(currentUserId);
    }
}
