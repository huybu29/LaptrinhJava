package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.repo.dtos.BatteryDTO;
import project.repo.entity.Battery;

@Mapper(componentModel = "spring")
public interface BatteryMapper {
    BatteryDTO toDTO(Battery battery);
    
    @Mapping(target = "status", expression = "java(dto.getStatus() == null ? null : project.repo.entity.Battery.BatteryStatus.valueOf(dto.getStatus()))")
    Battery toBattery(BatteryDTO dto);
}