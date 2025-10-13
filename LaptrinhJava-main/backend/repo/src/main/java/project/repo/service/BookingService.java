package project.repo.service;

import org.springframework.stereotype.Service;
import project.repo.dtos.BookingDTO;
import project.repo.entity.Booking;
import project.repo.entity.User;
import project.repo.mapper.BookingMapper;
import project.repo.repository.BookingRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    public BookingService(BookingRepository bookingRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.bookingMapper = bookingMapper;
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 🟣 Thêm booking mới
    public BookingDTO createBooking(BookingDTO dto, User user) {
        Booking booking = bookingMapper.toEntity(dto, user);
        bookingRepository.save(booking);
        return bookingMapper.toDTO(booking);
    }
}
