package project.repo.dtos;

import java.time.LocalDateTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String password;
    private String email;
    private String phone;
    private String role;
    private String status;   // ACTIVE, INACTIVE
    private LocalDateTime createdAt;
}
