package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String vin; 

    private String licensePlate;
    private String model;

    @Enumerated(EnumType.STRING)
    private BatteryType batteryType;

    // Liên kết với tài xế
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;
    public enum BatteryType {
    LITHIUM_ION,
    NICKEL_METAL_HYDRIDE,
    SOLID_STATE
}
}