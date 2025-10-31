package project.repo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.GenerationType;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BatteryPackage {
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Thông tin người dùng đăng ký
    private Long userId;            // Liên kết sang User Service
    private Long vehicleId;         // Xe đang dùng gói này

    // Thông tin gói pin
    private String packageName;     // VD: "Gói tháng cơ bản", "Premium 100 lần"
    private String description;
    private Double price;           // Giá thuê
    private String durationType;    // MONTHLY, YEARLY, PER_USE
    private Integer swapLimit;      // Giới hạn số lượt đổi pin trong gói

    // Trạng thái đăng ký
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;

    // Thông tin thống kê
    private Integer swapsUsed;      // Số lượt đã dùng
    private Double totalPaid;       // Tổng tiền đã thanh toán (nếu trả theo kỳ)

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
