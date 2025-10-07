package project.repo.dtos;

import lombok.Data;
import project.repo.entity.AppUser;

@Data
public class ProfileDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String role;

    // Convert từ entity -> DTO
    public static ProfileDTO fromEntity(AppUser user) {
        ProfileDTO dto = new ProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        return dto;
    }
}
