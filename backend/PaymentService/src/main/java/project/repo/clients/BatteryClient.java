package project.repo.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.BatteryDTO;
import java.util.List;


@FeignClient(
    name = "vehicle-battery-service",
    url = "http://localhost:8083/api/batteries"  
)
public interface BatteryClient {

    @PutMapping("/{id}/status")
    BatteryDTO updateBatteryStatus(
        @PathVariable("id") Long id,
        @RequestParam("status") String status,
        @RequestParam(value = "stationId", required = false) Long stationId,
        @RequestParam(value = "vehicleId", required = false) Long vehicleId
    );
    @GetMapping("/{id}")
    BatteryDTO getBatteryById(@PathVariable("id") Long id);
}