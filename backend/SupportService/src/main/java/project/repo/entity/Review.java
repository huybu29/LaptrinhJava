package project.repo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    @Column(nullable = false)
    private Long userId; 

   
    @Column(nullable = false)
    private Long stationId;

 
    @Column(nullable = false)
    private Long paymentId;



    @Column(nullable = false)
    private Integer rating; // 1-5 sao

    @Column(columnDefinition = "TEXT")
    private String comment;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}