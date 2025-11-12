package project.repo.dtos;

import lombok.Data;

@Data
public class BatteryDTO {
    private Long id;
    private String batteryCode;
    private String status;
    private Float capacityKwh;
    private float soh;
    private Long stationId;
    private Long vehicleId;
    private Integer chargeCycles;
    private Integer maxChargeCycles;
}