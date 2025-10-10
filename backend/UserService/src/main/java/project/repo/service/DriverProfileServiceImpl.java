package project.repo.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.entity.DriverProfile;
import project.repo.repository.DriverProfileRepository;
import project.repo.service.DriverProfileService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverProfileServiceImpl implements DriverProfileService {

    private final DriverProfileRepository driverProfileRepository;

    @Override
    public DriverProfile createProfile(DriverProfile profile) {
        return driverProfileRepository.save(profile);
    }

    @Override
    public DriverProfile getProfileById(Long id) {
        return driverProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));
    }

    @Override
    public List<DriverProfile> getAllProfiles() {
        return driverProfileRepository.findAll();
    }

    @Override
    public DriverProfile updateProfile(Long id, DriverProfile profile) {
        DriverProfile existing = getProfileById(id);
        existing.setFullName(profile.getFullName());
        existing.setLicenseNumber(profile.getLicenseNumber());
        existing.setPhone(profile.getPhone());
        return driverProfileRepository.save(existing);
    }

    @Override
    public void deleteProfile(Long id) {
        driverProfileRepository.deleteById(id);
    }
}
