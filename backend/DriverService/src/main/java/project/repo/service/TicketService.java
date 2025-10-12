package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.dtos.TicketDTO;
import project.repo.entity.Ticket;
import project.repo.mapper.TicketMapper;
import project.repo.repository.TicketRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    public Ticket createTicket(TicketDTO dto) {
        Ticket ticket = ticketMapper.toEntity(dto);
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
}
