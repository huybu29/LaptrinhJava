package project.repo.dtos;
import project.repo.entity.User.Role;
import lombok.Data;

@Data
public class UserDTO {
  private Long id;
  private String username;
  private Role role;
  
}
