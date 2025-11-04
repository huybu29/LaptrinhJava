package project.repo.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(
    name = "vehicle-battery-service",
    url = "http://localhost:8083"
)
public interface BatteryClient {

    @GetMapping("/api/batteries/station/{stationId}/available/count")
    Long countAvailableBatteries(@PathVariable("stationId") Long stationId);
}
