package project.repo.controllers;

import org.springframework.web.bind.annotation.*;
import project.repo.dtos.BookingDTO;
import project.repo.entity.User;
import project.repo.service.BookingService;
import project.repo.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    // 🟢 Lấy tất cả bookings
    @GetMapping
    public List<BookingDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // 🟣 Tạo booking mới
    @PostMapping
    public BookingDTO createBooking(@RequestBody BookingDTO bookingDTO) {
        // Giả sử bookingDTO có userName → tìm user tương ứng
        User user = userRepository.findByUsername(bookingDTO.getUserName());
        return bookingService.createBooking(bookingDTO, user);
    }
}
