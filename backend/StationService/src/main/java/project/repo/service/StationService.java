package project.repo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import project.repo.entity.Station;
import project.repo.repository.StationRepository;

@Service
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    // =========================
    // Các hàm gốc của bạn (giữ nguyên)
    // =========================

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

    // =========================
    // 🆕 HÀM MỚI: Tìm trạm gần nhất
    // =========================
    public Optional<Station> findNearestStation(double userLat, double userLon) {
        List<Station> stations = stationRepository.findAll();

        if (stations.isEmpty()) {
            return Optional.empty();
        }

        Station nearest = stations.get(0);
        double minDistance = distance(userLat, userLon,
                nearest.getLatitude(), nearest.getLongitude());

        for (Station station : stations) {
            double dist = distance(userLat, userLon,
                    station.getLatitude(), station.getLongitude());
            if (dist < minDistance) {
                minDistance = dist;
                nearest = station;
            }
        }

        return Optional.of(nearest);
    }

    // ✅ Hàm tính khoảng cách giữa 2 tọa độ GPS (đơn vị: km)
    private double distance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Bán kính Trái đất (km)
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
