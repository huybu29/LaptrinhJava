package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.entity.Ticket;
import project.repo.entity.TicketReply;
import project.repo.repository.TicketReplyRepository;
import project.repo.repository.TicketRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketReplyService {

    private final TicketReplyRepository ticketReplyRepository;
    private final TicketRepository ticketRepository;

    public TicketReply addReplyToTicket(Long ticketId, TicketReply reply) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        reply.setTicket(ticket);
        return ticketReplyRepository.save(reply);
    }

    public List<TicketReply> getRepliesByTicketId(Long ticketId) {
        return ticketReplyRepository.findByTicketId(ticketId);
    }
}
