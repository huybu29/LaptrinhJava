package project.repo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Table(name = "batteries")
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
  private Float capacityKwh;
  private Long stationId;
   @Enumerated(EnumType.STRING)
  private BatteryStatus status;
  private LocalDateTime lastUsedAt;
  public enum BatteryStatus{
   AVAILABLE, IN_USE, CHARGING, MAINTENANCE
  }


}
