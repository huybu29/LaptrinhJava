package project.repo.dtos;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO cho entity Appointment.
 * Dùng để truyền dữ liệu giữa controller/service và các microservice khác.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {

    private Long id;

    private LocalDateTime appointmentDate;

   
    private String status;      // Dạng String (PENDING, CONFIRMED,...)

    private String notes;

    private Long customerId;        // ID khách hàng (từ CustomerService)
    private Long vehicleId;         // ID xe (từ VehicleService)
    private Long serviceCenterId;   // ID trung tâm dịch vụ (từ 
}
