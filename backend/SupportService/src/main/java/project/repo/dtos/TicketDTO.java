package project.repo.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TicketDTO {
     private Long id;
    private Long userId;
    private Long stationId;
    private String subject;
    private String description;
    private String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
