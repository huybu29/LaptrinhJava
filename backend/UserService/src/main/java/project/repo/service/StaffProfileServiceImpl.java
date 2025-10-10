package project.repo.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.entity.StaffProfile;
import project.repo.repository.StaffProfileRepository;
import project.repo.service.StaffProfileService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffProfileServiceImpl implements StaffProfileService {

    private final StaffProfileRepository staffProfileRepository;

    @Override
    public StaffProfile createProfile(StaffProfile profile) {
        return staffProfileRepository.save(profile);
    }

    @Override
    public StaffProfile getProfileById(Long id) {
        return staffProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));
    }

    @Override
    public List<StaffProfile> getAllProfiles() {
        return staffProfileRepository.findAll();
    }

    @Override
    public StaffProfile updateProfile(Long id, StaffProfile profile) {
        StaffProfile existing = getProfileById(id);
        existing.setFullName(profile.getFullName());
        existing.setDepartment(profile.getDepartment());
        existing.setPosition(profile.getPosition());
        return staffProfileRepository.save(existing);
    }

    @Override
    public void deleteProfile(Long id) {
        staffProfileRepository.deleteById(id);
    }
}
