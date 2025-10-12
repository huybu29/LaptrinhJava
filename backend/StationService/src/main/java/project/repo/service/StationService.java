package project.repo.service;

import org.springframework.stereotype.Service;
import project.repo.entity.Station;
import project.repo.repository.StationRepository;

import java.util.List;
import java.util.Optional;

@Service
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public Optional<Station> getStationById(Long id) {
        return stationRepository.findById(id);
    }

    public Station createStation(Station station) {
        return stationRepository.save(station);
    }

    public Station updateStation(Long id, Station updatedStation) {
        return stationRepository.findById(id).map(station -> {
            station.setName(updatedStation.getName());
            station.setLocation(updatedStation.getLocation());
            station.setCapacity(updatedStation.getCapacity()); 
            return stationRepository.save(station);
        }).orElseThrow(() -> new RuntimeException("Station not found"));
    }

    public void deleteStation(Long id) {
        stationRepository.deleteById(id);
    }

    public int getTotalPinCount() {
        return stationRepository.findAll().stream()
                .mapToInt(Station::getCapacity) 
                .sum();
    }

    public int getPinCountById(Long id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        return station.getCapacity();
    }

    public Station updatePinCount(Long id, int newCount) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        station.setCapacity(newCount);
        return stationRepository.save(station);
    }
}
