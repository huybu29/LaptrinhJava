package project.repo.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleDTO {
  private Long id;
  private String vin;
  private String batteryType;
  private Long ownerId;
  private Long currentBatteryId;
  private LocalDateTime registeredAt;
} 