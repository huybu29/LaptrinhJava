package project.repo.mapper;

import org.mapstruct.Mapper;

import project.repo.dtos.VehicleDTO;
import project.repo.entity.Vehicle;

@Mapper(componentModel = "spring")
public interface VehicleMapper {
  VehicleDTO toDto(Vehicle vehicle);
  Vehicle toVehicle(VehicleDTO dto);
}
