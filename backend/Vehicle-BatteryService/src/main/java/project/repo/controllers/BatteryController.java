package project.repo.controllers;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project.repo.dtos.BatteryDTO;
import project.repo.service.BatteryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;


@RestController
@RequestMapping("/api/batteries")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class BatteryController {
  private final BatteryService batteryService;
  @GetMapping("")
  public List<BatteryDTO> getAllBattery() {
      return batteryService.getAllBattery();
  };
  @GetMapping("/{id}")
  public BatteryDTO getBatteryById(@PathVariable Long id) {
      return batteryService.getBatteryById(id);
  }
  @PutMapping("/{id}")
  public BatteryDTO upBatteryDTO(@PathVariable String id, @RequestBody BatteryDTO dto) {
      
      return batteryService.updateBattery(dto);
  }
  @PostMapping("")
  public BatteryDTO createBattery(@RequestBody BatteryDTO dto) {
      return batteryService.createBattery(dto);
  }
  @DeleteMapping("/{id}")
  public void deleteBattery(@PathVariable Long id) {
      batteryService.deleteBattery(id);
  }
}
