package project.repo.mapper;

import org.springframework.stereotype.Component;
import project.repo.dtos.TicketDTO;
import project.repo.entity.Ticket;

import java.time.LocalDateTime;

@Component
public class TicketMapper {

    public Ticket toEntity(TicketDTO dto) {
        Ticket ticket = new Ticket();
        ticket.setDriverName(dto.getDriverName());
        ticket.setIssue(dto.getIssue());
        ticket.setStatus("NEW");
        ticket.setCreatedAt(LocalDateTime.now());
        return ticket;
    }
}
