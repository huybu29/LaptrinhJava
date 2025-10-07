package project.repo.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthRequest {
    private String username;
    private String password;

    
    private String role;      
    private String fullName;  
    private String email;     
    private String phone;     
}