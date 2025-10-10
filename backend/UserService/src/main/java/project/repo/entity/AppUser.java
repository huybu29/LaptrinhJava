package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")   // bảng DB là "users"
@Data                   // tự động sinh getter, setter, toString, equals/hashCode
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

    // Thông tin cơ bản                                 
    private String fullName;
    private String email;
    private String phone;

    // Quan hệ 1-1 đến các profile
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private DriverProfile driverProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private StaffProfile staffProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private AdminProfile adminProfile;
}
