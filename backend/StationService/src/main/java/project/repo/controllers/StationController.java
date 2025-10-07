package project.repo.controllers;

import org.springframework.web.bind.annotation.*;
import project.repo.dtos.StationDTO;
import project.repo.entity.Station;
import project.repo.mapper.StationMapper;
import project.repo.service.StationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping
    public List<StationDTO> getAllStations() {
        return stationService.getAllStations()
                .stream()
                .map(StationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public StationDTO getStationById(@PathVariable Long id) {
        return stationService.getStationById(id)
                .map(StationMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Station not found"));
    }

    @PostMapping
    public StationDTO createStation(@RequestBody StationDTO stationDTO) {
        Station station = StationMapper.toEntity(stationDTO);
        return StationMapper.toDTO(stationService.createStation(station));
    }

    @PutMapping("/{id}")
    public StationDTO updateStation(@PathVariable Long id, @RequestBody StationDTO stationDTO) {
        Station updated = StationMapper.toEntity(stationDTO);
        return StationMapper.toDTO(stationService.updateStation(id, updated));
    }

    @DeleteMapping("/{id}")
    public void deleteStation(@PathVariable Long id) {
        stationService.deleteStation(id);
    }
}
