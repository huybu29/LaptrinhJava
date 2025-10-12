package project.repo.mapper;

import project.repo.dtos.StationDTO;
import project.repo.entity.Station;

public class StationMapper {
    public static Station toEntity(StationDTO dto) {
        return new Station(dto.getName(), dto.getLocation(), dto.getCapacity());
    }

    public static StationDTO toDTO(Station entity) {
        return new StationDTO(entity.getName(), entity.getLocation(), entity.getCapacity());
    }
}
