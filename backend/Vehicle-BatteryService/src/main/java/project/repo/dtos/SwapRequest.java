package project.repo.dtos;
import lombok.Data;
import lombok.Builder;

@Data
@Builder

public class SwapRequest {
    private Long vehicleId;
    private Long stationId;
    private Long newBatteryId;
    private Long oldBatteryId; // có thể null nếu xe chưa có pin
    private String notes;
}
