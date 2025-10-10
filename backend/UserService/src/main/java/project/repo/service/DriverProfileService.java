package project.repo.service;

import project.repo.entity.DriverProfile;

import java.util.List;

public interface DriverProfileService {
    DriverProfile createProfile(DriverProfile profile);
    DriverProfile getProfileById(Long id);
    List<DriverProfile> getAllProfiles();
    DriverProfile updateProfile(Long id, DriverProfile profile);
    void deleteProfile(Long id);
}
