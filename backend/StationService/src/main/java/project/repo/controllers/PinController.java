package project.repo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.repo.entity.Pin;
import project.repo.repository.PinRepository;

import java.util.List;

@RestController
@RequestMapping("/api/pins")
@CrossOrigin(origins = "*")
public class PinController {

    @Autowired
    private PinRepository pinRepository;

    @GetMapping
    public List<Pin> getAllPins() {
        return pinRepository.findAll();
    }

    @GetMapping("/count")
    public long getAvailablePinCount() {
        return pinRepository.countByStatus("available");
    }

    @PostMapping
    public Pin addPin(@RequestBody Pin pin) {
        return pinRepository.save(pin);
    }
}
