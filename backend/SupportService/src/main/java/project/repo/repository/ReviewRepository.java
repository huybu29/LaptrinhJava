package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}