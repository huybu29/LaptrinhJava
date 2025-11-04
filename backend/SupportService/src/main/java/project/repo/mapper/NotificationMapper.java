package project.repo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.repo.entity.Notification;
import project.repo.dtos.NotificationDTO;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationDTO toDTO(Notification notification);
    Notification toEntity(NotificationDTO dto);
}
