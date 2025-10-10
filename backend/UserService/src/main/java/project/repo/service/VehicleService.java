package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.dtos.VehicleDTO;
import project.repo.entity.User;
import project.repo.entity.Vehicle;
import project.repo.mapper.VehicleMapper;
import project.repo.repository.UserRepository;
import project.repo.repository.VehicleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleDTO addVehicle(VehicleDTO vehicleDTO) {
        User driver = userRepository.findById(vehicleDTO.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Vehicle vehicle = vehicleMapper.toEntity(vehicleDTO, driver);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toDto(savedVehicle);
    }

    public List<VehicleDTO> getVehiclesByDriver(Long driverId) {
        return vehicleRepository.findByDriver_Id(driverId)
                .stream()
                .map(vehicleMapper::toDto)
                .collect(Collectors.toList());
    }
}
