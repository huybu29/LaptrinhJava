package project.repo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project.repo.dtos.VehicleDTO;
import project.repo.mapper.VehicleMapper;
import project.repo.repository.VehicleRepository;

@Service
@RestController
@RequiredArgsConstructor
public class VehicleService {
  private final VehicleRepository vehicleRepository;
  private final VehicleMapper vehicleMapper;
  public List<VehicleDTO> getAllVehicle(){
    return vehicleRepository.findAll().stream().map(vehicle -> vehicleMapper.toDto(vehicle)).collect(Collectors.toList());
  };
  public VehicleDTO createVehicle(VehicleDTO dto){
    return vehicleMapper.toDto(vehicleRepository.save(vehicleMapper.toVehicle(dto)));
  };
  public VehicleDTO getVehicleById(Long id){
    return vehicleRepository.findById(id).map(vehicle -> vehicleMapper.toDto(vehicle)).orElse(null);
  };
  public  VehicleDTO updateVehicleById(Long id, VehicleDTO dto){
    return vehicleRepository.findById(id).map(vehicle ->{
      vehicle.setVin(dto.getVin());
      vehicle.setBatteryType(dto.getBatteryType());
      vehicle.setOwnerId(dto.getOwnerId());
      return vehicleMapper.toDto(vehicleRepository.save(vehicle));
    }) .orElse(null);
  };
  public VehicleDTO getVehicleByVin(String vin){
    return vehicleMapper.toDto(vehicleRepository.getVehicleByVin(vin));
  };
  
}
