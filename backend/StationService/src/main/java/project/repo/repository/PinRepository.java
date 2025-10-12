package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.repo.entity.Pin;

@Repository
public interface PinRepository extends JpaRepository<Pin, Long> {
    long countByStatus(String status);
}
