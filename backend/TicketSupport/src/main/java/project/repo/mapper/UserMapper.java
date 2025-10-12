package project.repo.mapper;

import org.mapstruct.Mapper;

import project.repo.dtos.UserDTO;
import project.repo.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
  UserDTO toDto(User user);
  User toUser(UserDTO dto);
  
} 
  

