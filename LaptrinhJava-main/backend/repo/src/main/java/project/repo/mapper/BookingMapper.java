package project.repo.mapper;

import org.springframework.stereotype.Component;
import project.repo.dtos.BookingDTO;
import project.repo.entity.Booking;
import project.repo.entity.User;

@Component
public class BookingMapper {

    // Entity → DTO
    public BookingDTO toDTO(Booking booking) {
        if (booking == null) return null;

        String userName = (booking.getUser() != null)
                ? booking.getUser().getUsername()   // 👈 hoặc getName() nếu User có field đó
                : null;

        return new BookingDTO(
                booking.getId(),
                userName,
                booking.getStatus(),
                booking.getCreatedAt(),
                booking.getCompletedAt()
        );
    }

    // DTO → Entity (khi tạo mới booking)
    public Booking toEntity(BookingDTO dto, User user) {
        if (dto == null) return null;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setStatus(dto.getStatus());
        booking.setCreatedAt(dto.getCreatedAt());
        booking.setCompletedAt(dto.getCompletedAt());
        return booking;
    }
}
