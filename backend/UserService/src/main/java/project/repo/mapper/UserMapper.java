package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.repo.dtos.UserDTO;
import project.repo.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Chuyển từ entity sang DTO
    @Mapping(target = "role", source = "role")
    UserDTO toDto(User user);

    // Chuyển từ DTO sang entity
    @Mapping(target = "password", ignore = true) // không map password từ DTO
    User toEntity(UserDTO dto);
}
