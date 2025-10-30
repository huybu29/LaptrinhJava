package project.repo.service;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import project.repo.entity.User;
import project.repo.mapper.UserMapper;
import project.repo.repository.UserRepository;

import project.repo.dtos.UserDTO;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
   
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    public List<UserDTO> getAllUsers(){
        return userRepository.findAll().stream().map(user -> userMapper.toDto(user)).collect(Collectors.toList());
    }
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toDto(user);
    }
    // 🔹 Tạo user mới (ADMIN)
    public UserDTO createUser(UserDTO dto) {
        User user = userMapper.toEntity(dto);
        // mật khẩu cần mã hóa trước khi lưu (Spring Security PasswordEncoder)
        // user.setPassword(passwordEncoder.encode(dto.getPassword()));
        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    // 🔹 Cập nhật user (ADMIN)
    public UserDTO updateUser(Long id, UserDTO dto) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    user.setFullName(dto.getFullName());
    user.setEmail(dto.getEmail());
    user.setPhone(dto.getPhone());
    user.setRole(dto.getRole());

    // Chuyển String sang enum
    if (dto.getStatus() != null) {
        user.setStatus(User.Status.valueOf(dto.getStatus()));
    }

    // Cập nhật mật khẩu nếu có (vẫn cần PasswordEncoder)
    if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
        user.setPassword(dto.getPassword());
    }

    User saved = userRepository.save(user);
    return userMapper.toDto(saved);
}


    // 🔹 Xóa user (ADMIN)
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UsernameNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    
   
}
