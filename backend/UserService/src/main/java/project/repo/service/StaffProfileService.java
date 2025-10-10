package project.repo.service;

import project.repo.entity.StaffProfile;

import java.util.List;

public interface StaffProfileService {
    StaffProfile createProfile(StaffProfile profile);
    StaffProfile getProfileById(Long id);
    List<StaffProfile> getAllProfiles();
    StaffProfile updateProfile(Long id, StaffProfile profile);
    void deleteProfile(Long id);
}
