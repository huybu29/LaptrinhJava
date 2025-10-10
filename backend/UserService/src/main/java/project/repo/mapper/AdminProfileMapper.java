package project.repo.mapper;

import org.mapstruct.Mapper;
import project.repo.dtos.AdminProfileDTO;
import project.repo.entity.AdminProfile;

@Mapper(componentModel = "spring")
public interface AdminProfileMapper {
    AdminProfileDTO toDto(AdminProfile entity);
    AdminProfile toEntity(AdminProfileDTO dto);
}