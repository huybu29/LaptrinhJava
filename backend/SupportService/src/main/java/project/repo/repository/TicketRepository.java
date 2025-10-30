package project.repo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import project.repo.entity.Ticket;
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
  List<Ticket> findByUserId(Long userId);
}
