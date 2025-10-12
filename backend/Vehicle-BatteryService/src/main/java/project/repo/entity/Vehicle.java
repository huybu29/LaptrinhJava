package project.repo.entity;
import java.lang.annotation.Inherited;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  public Long id;
  public String vin;
  public String batteryType;
  public Long ownerId;
  
}
