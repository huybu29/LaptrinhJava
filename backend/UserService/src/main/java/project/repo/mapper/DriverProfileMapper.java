package project.repo.mapper;

import org.mapstruct.Mapper;
import project.repo.dtos.DriverProfileDTO;
import project.repo.entity.DriverProfile;

@Mapper(componentModel = "spring")
public interface DriverProfileMapper {
    DriverProfileDTO toDto(DriverProfile entity);
    DriverProfile toEntity(DriverProfileDTO dto);
}