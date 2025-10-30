package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.repo.dtos.TicketDTO;
import project.repo.service.TicketService;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // 🔹 Helper kiểm tra role (giống StationController)
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Tạo ticket (CUSTOMER)
    @PostMapping
    public TicketDTO createTicket(
            @RequestBody TicketDTO dto,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId
    ) {
        checkRole(role, "CUSTOMER");
        dto.setUserId(userId); // ✅ gán userId từ header
        return ticketService.createTicket(dto);
    }

    // 🔹 Lấy tất cả ticket (ADMIN, STAFF)
    @GetMapping
    public List<TicketDTO> getAllTickets(
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return ticketService.getAllTickets();
    }

    // 🔹 Lấy các ticket của chính mình (CUSTOMER)
    @GetMapping("/me")
    public List<TicketDTO> getMyTickets(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId
    ) {
        checkRole(role, "CUSTOMER", "ADMIN", "STAFF");
        return ticketService.getTicketsByUserId(userId);
    }

    // 🔹 Lấy ticket theo userId (ADMIN, STAFF)
    @GetMapping("/user/{userId}")
    public List<TicketDTO> getTicketsByUser(
            @PathVariable Long userId,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return ticketService.getTicketsByUserId(userId);
    }

    // 🔹 Cập nhật trạng thái ticket (ADMIN, STAFF)
    @PutMapping("/{id}/status")
    public TicketDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN", "STAFF");
        return ticketService.updateStatus(id, status);
    }

    // 🔹 Xóa ticket (ADMIN, STAFF hoặc chính chủ)
    @DeleteMapping("/{id}")
    public String deleteTicket(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-User-Id", required = false) Long userId
    ) {
        if (role.equalsIgnoreCase("ROLE_ADMIN") || role.equalsIgnoreCase("ROLE_STAFF")) {
            ticketService.deleteTicket(id);
            return "✅ Ticket deleted by admin/staff";
        }

        // Nếu là CUSTOMER thì chỉ được xóa ticket của chính mình
        var myTickets = ticketService.getTicketsByUserId(userId);
        boolean owns = myTickets.stream().anyMatch(t -> t.getId().equals(id));

        if (!owns) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "❌ Bạn không thể xóa ticket của người khác");
        }

        ticketService.deleteTicket(id);
        return "✅ Ticket deleted successfully";
    }

    // 🔹 Xóa tất cả ticket (chỉ ADMIN)
    @DeleteMapping("/clear")
    public String clearAll(
            @RequestHeader("X-User-Role") String role
    ) {
        checkRole(role, "ADMIN");
        ticketService.clearAll();
        return "✅ All tickets deleted (for testing)";
    }

    // 🔹 Kiểm tra API
    @GetMapping("/test")
    public String test() {
        return "✅ Ticket Service is running!";
    }
}
