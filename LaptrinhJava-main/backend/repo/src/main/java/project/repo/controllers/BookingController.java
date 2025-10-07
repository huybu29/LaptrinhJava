package project.repo.controllers;

import org.springframework.web.bind.annotation.*;
import project.repo.service.BookingService;
import java.util.List;
import project.repo.entity.Booking;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}/confirm")
    public String confirmBooking(@PathVariable Long id) {
        return bookingService.confirmBooking(id);
    }
}
