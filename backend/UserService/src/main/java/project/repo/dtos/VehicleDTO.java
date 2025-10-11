package project.repo.dtos;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {
    private Long id;
    private String vin;
    private String licensePlate;
    private String model;
    private String batteryType;
    private Long driverId;
}
