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
    return vehicleRepository.findAll().stream().map(vehicle -> vehicleMapper.toDTO(vehicle)).collect(Collectors.toList());
  };
  public VehicleDTO createVehicle(VehicleDTO dto){
    return vehicleMapper.toDTO(vehicleRepository.save(vehicleMapper.toVehicle(dto)));
  };
  public VehicleDTO getVehicleById(Long id){
    return vehicleRepository.findById(id).map(vehicle -> vehicleMapper.toDTO(vehicle)).orElse(null);
  };
  public  VehicleDTO updateVehicleById(Long id, VehicleDTO dto){
    return vehicleRepository.findById(id).map(vehicle ->{
      vehicle.setVin(dto.getVin());
      vehicle.setBatteryType(dto.getBatteryType());
      vehicle.setOwnerId(dto.getOwnerId());
      return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }) .orElse(null);
  };
  public VehicleDTO getVehicleByVin(String vin){
    return vehicleMapper.toDTO(vehicleRepository.getVehicleByVin(vin));
  };
  public List<VehicleDTO> getVehicleByUserId(Long id){
    return vehicleRepository.getVehicleByOwnerId(id).stream().map(vehicle -> vehicleMapper.toDTO(vehicle)).collect(Collectors.toList());

  }
  public void deleteVehicle(Long id){
    vehicleRepository.deleteById(id);
  }
}
