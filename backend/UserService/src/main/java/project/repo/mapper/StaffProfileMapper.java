package project.repo.mapper;

import org.mapstruct.Mapper;
import project.repo.dtos.StaffProfileDTO;
import project.repo.entity.StaffProfile;

@Mapper(componentModel = "spring")
public interface StaffProfileMapper {
    StaffProfileDTO toDto(StaffProfile entity);
    StaffProfile toEntity(StaffProfileDTO dto);
}