package project.repo.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ngày giờ hẹn
    @Column(nullable = false)
    private LocalDateTime appointmentDate;

   


   
    @Enumerated(EnumType.STRING)   
    @Column(nullable = false)
    private AppointmentStatus status;


    private String notes;


    private Long customerId;

 
    private Long vehicleId;

    private Long serviceCenterId;
        
    public enum AppointmentStatus {
        PENDING,        // Chờ xử lý
        CONFIRMED,      // Đã xác nhận
        IN_PROGRESS,    // Đang thực hiện
        COMPLETED,      // Hoàn tất
        CANCELED        // Đã hủy
    }
    

}
