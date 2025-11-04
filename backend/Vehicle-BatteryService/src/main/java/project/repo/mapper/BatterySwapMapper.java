package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.repo.dtos.BatterySwapResponse;
import project.repo.entity.BatterySwapLog;

@Mapper(componentModel = "spring")
public interface BatterySwapMapper {

    @Mapping(target = "success", constant = "true")
    @Mapping(target = "message", expression = "java(\"Battery swapped successfully\")")
    @Mapping(source = "oldBatteryId", target = "oldBatteryId")
    @Mapping(source = "newBatteryId", target = "newBatteryId")
    @Mapping(source = "swapTime", target = "swapTime")
    BatterySwapResponse toResponse(BatterySwapLog log);
}
