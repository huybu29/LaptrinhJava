package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.Station;

public interface StationRepository extends JpaRepository<Station, Long> {
}

