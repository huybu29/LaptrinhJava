package project.repo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.RequiredArgsConstructor;
import project.repo.mapper.BatteryMapper;
import project.repo.repository.BatteryRepository;
import project.repo.dtos.BatteryDTO;
import project.repo.entity.Battery;

@Service
@RestController
@RequiredArgsConstructor
public class BatteryService {
  private final BatteryRepository batteryRepository;
  private final BatteryMapper batteryMapper;
  public List<BatteryDTO> getAllBattery(){
    return batteryRepository.findAll().stream().map(battery -> batteryMapper.toDto(battery)).collect(Collectors.toList());
  };
  public BatteryDTO createBattery(BatteryDTO dto){
    return batteryMapper.toDto(batteryRepository.save(batteryMapper.toBattery(dto)));
  };
  public BatteryDTO getBatteryById(Long id){
    return batteryRepository.findById(id).map(battery -> batteryMapper.toDto(battery)).orElse(null);
  };
  public BatteryDTO updateBattery(BatteryDTO dto){
    return batteryMapper.toDto(batteryRepository.save(batteryMapper.toBattery(dto)));
  };
  public void deleteBattery(Long id){
    batteryRepository.deleteById(id);
  };
}
