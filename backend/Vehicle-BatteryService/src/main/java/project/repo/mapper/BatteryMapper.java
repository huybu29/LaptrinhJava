package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.repo.dtos.BatteryDTO;
import project.repo.entity.Battery;

@Mapper(componentModel = "spring")
public interface BatteryMapper {
    BatteryDTO toDTO(Battery battery);
    
    
    Battery toBattery(BatteryDTO dto);
}