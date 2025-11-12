package project.repo.dtos;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BatteryPackageDTO {

     private Long id;

    // Thông tin người dùng
    private Long userId;
    private Long vehicleId;

    // Thông tin gói thuê
    private String packageName;
    private String description;
    private Double price;
    private String durationType;
    private Integer swapLimit;

    // Trạng thái gói
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;

    // Thông tin sử dụng
    private Integer swapsUsed;
    private Double totalPaid;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
