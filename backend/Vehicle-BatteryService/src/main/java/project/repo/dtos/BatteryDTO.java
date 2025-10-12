package project.repo.dtos;

import lombok.Data;
import project.repo.entity.Battery.BatteryStatus;

@Data
public class BatteryDTO {
  private Long id;
  private String batteryCode;
  private BatteryStatus status;
  private float soh;
  private Long stationId; 
}
