package project.repo.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.entity.AdminProfile;
import project.repo.repository.AdminProfileRepository;
import project.repo.service.AdminProfileService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminProfileServiceImpl implements AdminProfileService {

    private final AdminProfileRepository adminProfileRepository;

    @Override
    public AdminProfile createProfile(AdminProfile profile) {
        return adminProfileRepository.save(profile);
    }

    @Override
    public AdminProfile getProfileById(Long id) {
        return adminProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin profile not found"));
    }

    @Override
    public List<AdminProfile> getAllProfiles() {
        return adminProfileRepository.findAll();
    }

    @Override
    public AdminProfile updateProfile(Long id, AdminProfile profile) {
        AdminProfile existing = getProfileById(id);
        existing.setFullName(profile.getFullName());
        existing.setEmail(profile.getEmail());
        existing.setPhone(profile.getPhone());
        return adminProfileRepository.save(existing);
    }

    @Override
    public void deleteProfile(Long id) {
        adminProfileRepository.deleteById(id);
    }
}
