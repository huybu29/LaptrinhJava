package project.repo.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Context;

import project.repo.dtos.*;
import project.repo.entity.*;
@Mapper(componentModel = "spring")
public interface VehicleMapper {
   @Mapping(source = "driver.id", target = "driverId")
    VehicleDTO toDto(Vehicle vehicle);

    
    default Vehicle toEntity(VehicleDTO dto, User driver){
      if (dto == null) return null;
        Vehicle vehicle = new Vehicle();
        vehicle.setId(dto.getId());
        vehicle.setLicensePlate(dto.getLicensePlate());
        vehicle.setModel(dto.getModel());
        vehicle.setDriver(driver); // Map driver trực tiếp từ User đã fetch
        return vehicle;
    }
}