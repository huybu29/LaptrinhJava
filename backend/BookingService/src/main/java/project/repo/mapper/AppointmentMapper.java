
package project.repo.mapper;
import org.springframework.stereotype.Component;
import project.repo.dtos.AppointmentDTO;
import project.repo.entity.Appointment;


import org.mapstruct.Mapper;
@Mapper(componentModel="spring")
public interface AppointmentMapper {



   public Appointment toEntity(AppointmentDTO dto);
   public AppointmentDTO toDto(Appointment entity);
}
