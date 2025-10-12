package project.repo.controllers;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import lombok.RequiredArgsConstructor;
import project.repo.dtos.VehicleDTO;
import project.repo.service.VehicleService;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {
  private final VehicleService vehicleService;
  @GetMapping("")
  public List<VehicleDTO> getAllVehicle(){
    return vehicleService.getAllVehicle();
  }
  @PostMapping("")
  public VehicleDTO createVehicle(@RequestBody VehicleDTO vehicleDTO){
    return vehicleService.createVehicle(vehicleDTO);
  }
  @GetMapping("/{id}")
  public VehicleDTO getVehicleById(@PathVariable Long id){
    return vehicleService.getVehicleById(id);
  }
  @PostMapping("/{id}")
  public VehicleDTO updateVehicleById(@PathVariable Long id, @RequestBody VehicleDTO dto){
    return vehicleService.updateVehicleById(id, dto);
}
  @GetMapping("/vin/{vin}")
  public VehicleDTO getVehicleByVin(@PathVariable String vin){
    return vehicleService.getVehicleByVin(vin);
  }
}