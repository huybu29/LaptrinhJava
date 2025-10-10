package project.repo.service;

import project.repo.entity.AdminProfile;

import java.util.List;

public interface AdminProfileService {
    AdminProfile createProfile(AdminProfile profile);
    AdminProfile getProfileById(Long id);
    List<AdminProfile> getAllProfiles();
    AdminProfile updateProfile(Long id, AdminProfile profile);
    void deleteProfile(Long id);
}
