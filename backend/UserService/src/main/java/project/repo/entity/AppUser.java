package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")   // bảng trong DB vẫn là "users"
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    private String role; // ROLE_USER, ROLE_ADMIN, ROLE_DRIVER, ROLE_STAFF

    // 🔹 Thêm các trường mới cho quản lý hồ sơ
    private String fullName;

    private String email;

    private String phone;
}
