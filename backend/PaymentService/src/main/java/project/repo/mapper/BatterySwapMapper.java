package project.repo.mapper;
import project.repo.entity.*;
import project.repo.dtos.*;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface BatterySwapMapper {
    BatterySwapDTO toDTO(BatterySwap entity);
    BatterySwap toEntity(BatterySwapDTO dto);
}