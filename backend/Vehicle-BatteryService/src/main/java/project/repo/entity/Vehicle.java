package project.repo.entity;
import java.lang.annotation.Inherited;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicles")
public class Vehicle {
  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  private Long id;
  private String vin;
 
  private String model;
  private String batteryType;
  private Long ownerId;
  private LocalDateTime registeredAt;
  
}
