package project.repo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import project.repo.entity.Booking;
@Service
public class BookingService {

    // Danh sách Booking giả lập
    private final List<Booking> bookings = new ArrayList<>();

    // Hàm tạo dữ liệu mẫu
    public BookingService() {
        Booking b1 = new Booking(1L, "Pending", LocalDateTime.now().minusDays(1), null);
        Booking b2 = new Booking(2L, "Completed", LocalDateTime.now().minusDays(2), LocalDateTime.now().minusDays(1));
        bookings.add(b1);
        bookings.add(b2);
    }

    // 1. Trả về tất cả booking
    public List<Booking> getAllBookings() {
        return bookings;
    }

    // 2. Xác nhận booking theo id
    public String confirmBooking(Long id) {
        for (Booking b : bookings) {
            if (b.getId().equals(id)) {
                b.setStatus("Confirmed");
                b.setCompletedAt(LocalDateTime.now());
                return "Booking " + id + " confirmed successfully!";
            }
        }
        return "Booking ID not found!";
    }

    // Test nhanh (nếu cần chạy riêng)
    public static void main(String[] args) {
        BookingService service = new BookingService();
        System.out.println(service.getAllBookings());
        System.out.println(service.confirmBooking(1L));
    }
}
