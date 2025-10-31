package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.BatteryPackageDTO;
import project.repo.entity.BatteryPackage;
import project.repo.mapper.BatteryPackageMapper;
import project.repo.repository.BatteryPackageRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BatteryPackageService {

    private final BatteryPackageRepository repository;
    private final BatteryPackageMapper batteryPackageMapper;
    
    public BatteryPackageDTO createPackage(BatteryPackageDTO dto) {
        BatteryPackage entity = batteryPackageMapper.toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setIsActive(true);
        return batteryPackageMapper.toDTO(repository.save(entity));
    }

    
    public BatteryPackageDTO updatePackage(Long id, BatteryPackageDTO dto) {
        BatteryPackage existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        existing.setPackageName(dto.getPackageName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setDurationType(dto.getDurationType());
        existing.setSwapLimit(dto.getSwapLimit());
        existing.setEndDate(dto.getEndDate());
        existing.setUpdatedAt(LocalDateTime.now());
        existing.setIsActive(dto.getIsActive());

        return batteryPackageMapper.toDTO(repository.save(existing));
    }

    
    public BatteryPackageDTO getPackageById(Long id) {
        BatteryPackage entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        return batteryPackageMapper.toDTO(entity);
    }

    
    public List<BatteryPackageDTO> getPackagesByUser(Long userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(batteryPackageMapper::toDTO)
                .collect(Collectors.toList());
    }

    
    public List<BatteryPackageDTO> getAllPackages() {
        return repository.findAll()
                .stream()
                .map(batteryPackageMapper::toDTO)
                .collect(Collectors.toList());
    }

    
    public void deletePackage(Long id) {
        repository.deleteById(id);
    }
}
