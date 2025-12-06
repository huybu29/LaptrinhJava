package project.repo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import project.repo.dtos.ReviewDTO;
import project.repo.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 🔹 Helper kiểm tra quyền (Giống TicketController)
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Tạo Review (Chỉ CUSTOMER, gán userId từ Header)
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @RequestBody ReviewDTO dto,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {
        
        checkRole(role, "CUSTOMER");
        dto.setUserId(userId); // Tự động gán người tạo là user đang đăng nhập
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(dto));
    }

    // 🔹 Cập nhật Review (Chính chủ hoặc Admin)
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewDTO dto,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        ReviewDTO existing = reviewService.getReviewById(id);
        
        // Nếu là CUSTOMER, chỉ được sửa bài của mình
        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !existing.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không thể sửa đánh giá của người khác");
        }
        
        checkRole(role, "CUSTOMER", "ADMIN");
        return ResponseEntity.ok(reviewService.updateReview(id, dto));
    }

    // 🔹 Lấy chi tiết Review (Public - Ai cũng xem được)
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    // 🔹 Lấy tất cả Review (Admin/Staff quản lý)
    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "ADMIN", "STAFF");
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // 🔹 Lấy Review theo Trạm (Public - Ai cũng xem được để tham khảo)
    @GetMapping("/station/{stationId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByStationId(@PathVariable Long stationId) {
        return ResponseEntity.ok(reviewService.getReviewsByStationId(stationId));
    }

    // 🔹 Lấy Review của User (Cá nhân xem của mình hoặc Admin xem)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {
        
        // Nếu là guest (không có role), chặn
        if (role == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        // Nếu là CUSTOMER, chỉ xem của mình (trừ khi logic cho phép xem profile người khác)
        // Ở đây giả sử cho xem thoải mái hoặc check:
        // if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !userId.equals(currentUserId)) ...

        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    // 🔹 Lấy Review theo lần đổi pin (Swap ID)
  

    // 🔹 Lấy điểm đánh giá trung bình của trạm (Public)
    @GetMapping("/station/{stationId}/average")
    public ResponseEntity<Double> getAverageRatingByStationId(@PathVariable Long stationId) {
        return ResponseEntity.ok(reviewService.getAverageRatingByStationId(stationId));
    }

    // 🔹 Lọc review theo số sao (Public)
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRating(@PathVariable Integer rating) {
        return ResponseEntity.ok(reviewService.getReviewsByRating(rating));
    }

    // 🔹 Xóa Review (Admin hoặc Chính chủ)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId) {
        
        ReviewDTO existing = reviewService.getReviewById(id);
        
        if ("ROLE_CUSTOMER".equalsIgnoreCase(role) && !existing.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không thể xóa đánh giá của người khác");
        }

        checkRole(role, "ADMIN", "CUSTOMER"); // Staff thường không được xóa review khách hàng tùy tiện
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}