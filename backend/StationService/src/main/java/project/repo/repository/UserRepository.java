package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.repo.entity.User;
 
public interface UserRepository extends JpaRepository<User, Long> {
  User findByUsername(String username);
}
