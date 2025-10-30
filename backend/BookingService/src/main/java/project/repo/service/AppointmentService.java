package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.AppointmentDTO;
import project.repo.entity.Appointment;

import project.repo.mapper.AppointmentMapper;
import project.repo.repository.AppointmentRepository;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    public AppointmentDTO create(AppointmentDTO dto) {
        Appointment appointment = appointmentMapper.toEntity(dto);

       

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
    public AppointmentDTO updateAppointment(AppointmentDTO dto) {
       
        return appointmentMapper.toDto(appointmentRepository.save(appointmentMapper.toEntity(dto)));
    }

    // 🔹 Xóa Appointment
    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }
}
