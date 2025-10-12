package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
