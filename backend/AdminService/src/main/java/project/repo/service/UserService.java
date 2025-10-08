package project.repo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import project.repo.dtos.UserDTO;
import project.repo.entity.User;
import project.repo.mapper.UserMapper;
import project.repo.repository.UserRepository;
@RestController
@Service 
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final UserMapper userMapper;
  public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> userMapper.toDto(user))
                .collect(Collectors.toList());
    }

   public UserDTO createUser(UserDTO dto) {
        User user = userMapper.toUser(dto);
        user.setPassword("{noop}123"); // demo password
        return userMapper.toDto(userRepository.save(user));}
   
   public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> userMapper.toDto(user))
                .orElse(null);}
   public UserDTO updateUser(Long id, UserDTO dto){
            return userRepository.findById(id)
                     .map(user -> {
                      user.setUsername(dto.getUsername());
                      user.setRole(dto.getRole());
                      user.setPassword("{noop}123");
                      return userMapper.toDto(userRepository.save(user));
                     })
                     .orElse(null);
   }
   public void deleteUser(Long id){
            userRepository.deleteById(id);
   }
}
