package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.TicketDTO;
import project.repo.entity.Ticket;
import project.repo.entity.TicketReply;
import project.repo.service.TicketService;
import project.repo.service.TicketReplyService;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final TicketReplyService ticketReplyService;

    
    @PostMapping
    public Ticket createTicket(@RequestBody TicketDTO dto) {
        return ticketService.createTicket(dto);
    }

    
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    
    @PutMapping("/{id}/status")
    public Ticket updateTicketStatus(@PathVariable Long id, @RequestParam("status") String status) {
        return ticketService.updateStatus(id, status);
    }

    
    @PostMapping("/{id}/reply")
    public TicketReply addReply(@PathVariable Long id, @RequestBody TicketReply reply) {
        return ticketReplyService.addReplyToTicket(id, reply);
    }

    
    @GetMapping("/{id}/replies")
    public List<TicketReply> getReplies(@PathVariable Long id) {
        return ticketReplyService.getRepliesByTicketId(id);
    }

    // Delete all ticket(test)
    @DeleteMapping("/clear")
    public void clearAllTickets() {
        ticketService.clearAll();
    }
}
