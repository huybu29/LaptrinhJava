package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Table(name = "support_tickets")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long stationId;    
    private String subject;
    @Enumerated(EnumType.STRING)
 
    private TicketStatus status;
    private LocalDateTime createdAt = LocalDateTime.now(); 
    private LocalDateTime resolvedAt;
    @Lob
    private String description;
    
    
    public enum TicketStatus {
    OPEN, IN_PROGRESS, RESOLVED, CLOSED
}
}
