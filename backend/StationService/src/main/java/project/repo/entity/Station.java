package project.repo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import jakarta.persistence.*;
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name="stations")
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;
    private Double latitude;
    private Double longitude;
    @Enumerated(EnumType.STRING)
    private StationStatus status; // ACTIVE, INACTIVE, MAINTENANCE
    @Column
    private int capacity; // số lượng pin hoặc dung lượng trạm
    public enum StationStatus {
    ACTIVE, INACTIVE, MAINTENANCE
}


  
}
