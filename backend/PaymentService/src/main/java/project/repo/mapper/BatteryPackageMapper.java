package project.repo.mapper;
import org.mapstruct.Mapper;
import project.repo.entity.*;
import project.repo.dtos.*;
@Mapper(componentModel = "spring")
public interface BatteryPackageMapper {
  BatteryPackageDTO toDTO(BatteryPackage batteryPackage);
  BatteryPackage toEntity(BatteryPackageDTO dto);
}
