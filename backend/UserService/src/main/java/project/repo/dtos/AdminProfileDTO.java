package project.repo.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
}
