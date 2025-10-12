package project.repo.mapper;

import org.mapstruct.Mapper;

import project.repo.dtos.BatteryDTO;
import project.repo.entity.Battery;

@Mapper(componentModel = "spring")
public interface BatteryMapper {
 BatteryDTO toDto(Battery battery);
 Battery toBattery(BatteryDTO dto);
  
} 
