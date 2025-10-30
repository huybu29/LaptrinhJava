package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.dtos.TicketDTO;
import project.repo.entity.Ticket;
import project.repo.entity.Ticket.TicketStatus;
import project.repo.mapper.TicketMapper;
import project.repo.repository.TicketRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    // ✅ Tạo mới ticket
    public TicketDTO createTicket(TicketDTO dto) {
        Ticket ticket = ticketMapper.toEntity(dto);
        ticket.setStatus(TicketStatus.OPEN);
        Ticket saved = ticketRepository.save(ticket);
        return ticketMapper.toDto(saved);
    }

    // ✅ Lấy tất cả ticket
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(ticketMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Lấy ticket theo userId
    public List<TicketDTO> getTicketsByUserId(Long userId) {
        return ticketRepository.findByUserId(userId)
                .stream()
                .map(ticketMapper::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Cập nhật trạng thái ticket
    public TicketDTO updateStatus(Long id, String status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(TicketStatus.valueOf(status.toUpperCase()));
        Ticket updated = ticketRepository.save(ticket);

        return ticketMapper.toDto(updated);
    }

    // ✅ Xóa ticket theo ID
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found");
        }
        ticketRepository.deleteById(id);
    }

    // ✅ Xóa toàn bộ ticket (dùng cho test)
    public void clearAll() {
        ticketRepository.deleteAll();
    }
}
