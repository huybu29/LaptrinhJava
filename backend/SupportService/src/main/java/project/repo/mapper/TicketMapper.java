package project.repo.mapper;

import org.springframework.stereotype.Component;
import project.repo.dtos.TicketDTO;
import project.repo.entity.Ticket;
import org.mapstruct.Mapper;
import java.time.LocalDateTime;

@Mapper(componentModel="spring")
public interface TicketMapper {
    public TicketDTO toDto(Ticket entity);
    public Ticket toEntity(TicketDTO dto);

}
