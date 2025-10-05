package project.repo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.repo.entity.TicketReply;
import java.util.List;

public interface TicketReplyRepository extends JpaRepository<TicketReply, Long> {
    List<TicketReply> findByTicketId(Long ticketId);
}
