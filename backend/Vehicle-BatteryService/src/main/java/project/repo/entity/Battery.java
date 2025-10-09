package project.repo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Battery {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String batteryCode;
  private float soh;
  private Long stationId;
  private BatteryStatus status;
  public enum BatteryStatus{
    FULL,
    CHARGING,
    EMPTY
  }


}
