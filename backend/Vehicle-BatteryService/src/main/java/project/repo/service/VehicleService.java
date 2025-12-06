package project.repo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import project.repo.dtos.VehicleDTO;
import project.repo.entity.Battery;
import project.repo.entity.Vehicle;
import project.repo.mapper.BatteryMapper;
import project.repo.mapper.VehicleMapper;
import project.repo.repository.BatteryRepository;
import project.repo.repository.VehicleRepository;

@Service
@RequiredArgsConstructor
public class VehicleService {
  private final VehicleRepository vehicleRepository;
  private final VehicleMapper vehicleMapper;
  private final BatteryMapper batteryMapper; 
    private final BatteryRepository batteryRepository;
  public List<VehicleDTO> getAllVehicle(){
    return vehicleRepository.findAll().stream().map(vehicle -> vehicleMapper.toDTO(vehicle)).collect(Collectors.toList());
  };
  @Transactional 
    public VehicleDTO createVehicle(VehicleDTO dto) {
        
        Vehicle vehicle = vehicleMapper.toVehicle(dto);
        
      
        if (vehicle.getRegisteredAt() == null) {
            vehicle.setRegisteredAt(LocalDateTime.now());
        }
        
       
        vehicle = vehicleRepository.save(vehicle);

       
        Battery battery = new Battery();
        
        // Mã pin theo VIN xe
        battery.setBatteryCode("BAT-" + (vehicle.getVin() != null ? vehicle.getVin() : vehicle.getId()));
        
        battery.setCapacityKwh(60.0f);
        battery.setSoh(100.0f);      
        
        
        battery.setStatus(Battery.BatteryStatus.IN_USE); 
      
        battery.setLastUsedAt(LocalDateTime.now());
        battery.setLastChargedAt(LocalDateTime.now());
        
        battery.setStationId(null); 
        battery.setVehicleId(vehicle.getId()); 
        battery = batteryRepository.save(battery);

       
        vehicle.setCurrentBatteryId(battery.getId());
        vehicle = vehicleRepository.save(vehicle);

        return vehicleMapper.toDTO(vehicle);
    }
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
  public VehicleDTO getVehicleByUserId(Long id){
    return vehicleRepository.getVehicleByOwnerId(id).stream().map(vehicle -> vehicleMapper.toDTO(vehicle)).findFirst().orElse(null);
  }
  public void deleteVehicle(Long id){
    vehicleRepository.deleteById(id);
  }
}