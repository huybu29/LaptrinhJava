package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String driverName;   // hoac driverID
    private String issue;        // mo ta su co
    private String status;       // NEW, IN_PROGRESS, RESOLVED
    private LocalDateTime createdAt;
}
