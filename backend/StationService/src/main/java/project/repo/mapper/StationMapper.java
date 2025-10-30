package project.repo.mapper;

import project.repo.dtos.StationDTO;
import project.repo.entity.Station;
import org.mapstruct.Mapper;
@Mapper(componentModel="spring")
public interface StationMapper {
    Station toEntity(StationDTO dto);
   StationDTO toDTO(Station entity);
}
