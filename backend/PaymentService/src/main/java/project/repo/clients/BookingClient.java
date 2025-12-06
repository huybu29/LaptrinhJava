package project.repo.clients;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import project.repo.dtos.AppointmentDTO;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
@FeignClient(
    name = "booking-service",
    url = "http://localhost:8081"  
)
public interface BookingClient {


    @GetMapping("/api/appointments/{id}/exists")
    @CircuitBreaker(name = "bookingServiceCircuit", fallbackMethod = "fallbackExists")
    boolean existsById(@PathVariable("id") Long id);

    @GetMapping("/api/appointments/{id}")
    AppointmentDTO getAppointmentById(@PathVariable("id") Long id);
   
    default boolean fallbackExists(Long id, Throwable throwable) {
        System.out.println("⚠️ [BookingClient Fallback] Không thể gọi BookingService: " + throwable.getMessage());
       
        return false; 
    }
    @PutMapping("/api/appointments/{id}/status")
    AppointmentDTO updateAppointmentStatus(
        @PathVariable("id") Long id,
        @RequestBody String status);
     
}
