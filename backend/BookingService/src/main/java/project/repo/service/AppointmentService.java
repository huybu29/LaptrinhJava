package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.repo.clients.*;
import project.repo.dtos.AppointmentDTO;
import project.repo.entity.Appointment;
import project.repo.entity.Appointment.AppointmentStatus;
import project.repo.mapper.AppointmentMapper;
import project.repo.repository.AppointmentRepository;


import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final BatteryClient batteryClient;
    private static final Set<AppointmentStatus> ACTIVE_STATUSES =
            Set.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS);

     public AppointmentDTO create(AppointmentDTO dto) {
        
        Long available = batteryClient.countAvailableBatteries(dto.getStationId());
        if (available == null || available <= 0) {
            throw new IllegalStateException("❌ Trạm không còn pin khả dụng để đặt lịch!");
        }

        boolean hasActive = appointmentRepository.existsByVehicleIdAndStatusIn(
                dto.getVehicleId(), ACTIVE_STATUSES);
        if (hasActive) {
            throw new IllegalStateException("❌ Xe này đã có booking đang hoạt động!");
        }

        Appointment appointment = appointmentMapper.toEntity(dto);
        appointment.setStatus(AppointmentStatus.PENDING);
        Appointment saved = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(saved);
    }
    // 🔹 Lấy tất cả Appointment
    public List<AppointmentDTO> getAllAppointment() {
        return appointmentRepository.findAll()
                .stream()
                .map(appointment -> appointmentMapper.toDto(appointment)).collect(Collectors.toList())
                ;
    }

    
    public AppointmentDTO getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(appointmentMapper::toDto)
                .orElse(null); 
    }

    // 🔹 Tìm Appointment theo Customer ID
    public List<AppointmentDTO> getAppointmentByCustomer(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId)
                .stream()
                .map(appointment -> appointmentMapper.toDto(appointment))
                .collect(Collectors.toList());
    }

    // 🔹 Tìm Appointment theo Vehicle ID
    public List<AppointmentDTO> getAppointmentByVehicle(Long vehicleId) {
        return appointmentRepository.findByVehicleId(vehicleId)
                .stream()
                .map(appointment -> appointmentMapper.toDto(appointment))
                .collect(Collectors.toList());
    }

    // 🔹 Cập nhật Appointment
   public AppointmentDTO updateStatus(Long id, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        AppointmentStatus current = appointment.getStatus();

        if (!isValidTransition(current, newStatus)) {
            throw new IllegalStateException("❌ Không thể chuyển từ " + current + " sang " + newStatus);
        }

        appointment.setStatus(newStatus);
        appointment.setUpdatedAt(java.time.LocalDateTime.now());

        Appointment updated = appointmentRepository.save(appointment);
        return appointmentMapper.toDto(updated);
    }

    private boolean isValidTransition(AppointmentStatus current, AppointmentStatus next) {
        return switch (current) {
            case PENDING -> next == AppointmentStatus.CONFIRMED || next == AppointmentStatus.CANCELED;
            case CONFIRMED -> next == AppointmentStatus.IN_PROGRESS || next == AppointmentStatus.CANCELED;
            case IN_PROGRESS -> next == AppointmentStatus.COMPLETED || next == AppointmentStatus.CANCELED;
            case COMPLETED, CANCELED -> false;
        };
    }
    // 🔹 Xóa Appointment
    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }
}
