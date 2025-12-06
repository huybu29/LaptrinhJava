package project.repo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import project.repo.dtos.StationDTO;
import project.repo.entity.Station;
import project.repo.repository.StationRepository;
import java.util.Comparator;

import java.util.stream.Collectors;

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
            station.setLatitude(updatedStation.getLatitude());
            station.setLongitude(updatedStation.getLongitude());
            station.setStatus(updatedStation.getStatus());
            station.setAiForecast(updatedStation.getAiForecast());
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


    public List<Station> findNearestStations(double userLat, double userLon, int n) {
    List<Station> stations = stationRepository.findAll();

    return stations.stream()
        .sorted(Comparator.comparingDouble(s -> distance(userLat, userLon, s.getLatitude(), s.getLongitude())))
        .limit(n)
        .collect(Collectors.toList());
}

    private double distance(double lat1, double lon1, double lat2, double lon2) {
    final int R = 6371; // Bán kính Trái đất (km)
    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);
    double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
               Math.sin(dLon/2) * Math.sin(dLon/2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // khoảng cách km
}   
public Station updateAiForecastOnly(StationDTO dto) {
        // 1. Tìm trạm theo ID trong DTO
        Station station = stationRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + dto.getId()));

        // 2. Chỉ cập nhật trường aiForecast
        // Các trường khác (name, location...) bỏ qua để tránh ghi đè null/rác
        if (dto.getAiForecast() != null) {
            station.setAiForecast(dto.getAiForecast());
        }

        // 3. Lưu lại
        return stationRepository.save(station);
    }
}
