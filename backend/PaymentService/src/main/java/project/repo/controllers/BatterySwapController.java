package project.repo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.BatterySwapDTO;
import project.repo.service.BatterySwapService;

import java.util.List;

@RestController
@RequestMapping("/api/swaps")
@RequiredArgsConstructor
public class BatterySwapController {

    private final BatterySwapService batterySwapService;

    @PostMapping("/")
    public BatterySwapDTO create(@RequestBody BatterySwapDTO dto) {
        return batterySwapService.createSwap(dto);
    }

    @GetMapping("/{id}")
    public BatterySwapDTO getById(@PathVariable Long id) {
        return batterySwapService.getSwapById(id);
    }

    @GetMapping("/user/{userId}")
    public List<BatterySwapDTO> getByUser(@PathVariable Long userId) {
        return batterySwapService.getSwapsByUser(userId);
    }

    @PutMapping("/{id}")
    public BatterySwapDTO update(@PathVariable Long id, @RequestBody BatterySwapDTO dto) {
        return batterySwapService.updateSwap(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        batterySwapService.deleteSwap(id);
    }
    @PostMapping("/execute")
    public BatterySwapDTO executeSwap(@RequestBody BatterySwapDTO req) {
        return batterySwapService.executePhysicalSwap(req);
    }
}                                                                                   
