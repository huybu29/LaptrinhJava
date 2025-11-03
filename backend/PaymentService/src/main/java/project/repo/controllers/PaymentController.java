package project.repo.controllers;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import project.repo.dtos.PaymentDto;
import project.repo.service.PaymentService;
import project.repo.clients.BookingClient;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Validated
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingClient bookingClient;
    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Lấy tất cả thanh toán (STAFF, ADMIN)
    @GetMapping("/")
    public List<PaymentDto> getAllPayment(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "STAFF", "ADMIN");
        return paymentService.getAllPayments();
    }

    // 🔹 Lấy thanh toán theo userID (CUSTOMER chỉ được xem thanh toán của mình, STAFF/ADMIN xem tất cả)
    @GetMapping("/{userID}")
    public List<PaymentDto> getPaymentByUserID(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long currentUserId,
            @PathVariable Long userID) {

        if ("ROLE_CUSTOMER".equalsIgnoreCase(role)) {
            if (!currentUserId.equals(userID)) {
                throw new RuntimeException("Access denied: CUSTOMER can only view their own payments");
            }
        } else {
            checkRole(role, "STAFF", "ADMIN");
        }

        return paymentService.getPaymentByUserId(userID);
    }

    // 🔹 Tạo thanh toán (CUSTOMER, STAFF, ADMIN)
    @PostMapping("/")
    public PaymentDto createPayment(
            @RequestHeader("X-User-Role") String role,
             @RequestHeader("X-User-Id") Long userId,
            @RequestBody PaymentDto dto) {

        checkRole(role, "CUSTOMER");
        return paymentService.createPayment(userId, dto);
    }
     @GetMapping("/me")
    public List<PaymentDto> getMyPayment(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long currentUserId
           ) {

        return paymentService.getPaymentByUserId(currentUserId);
   }
   @PutMapping("/{paymentId}")
public PaymentDto updatePayment(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader("X-User-Role") String role,
        @PathVariable Long paymentId,
        @RequestBody PaymentDto dto) {

   PaymentDto existing = paymentService.getById(paymentId);
    if (existing == null) {
        throw new RuntimeException("Payment không tồn tại.");
    }


    if ("COMPLETED".equalsIgnoreCase(existing.getStatus())) {
        throw new IllegalStateException("Không thể chỉnh sửa Payment đã thanh toán.");
    }

  
    if ("ROLE_CUSTOMER".equalsIgnoreCase(role)) {
        if (!existing.getUserID().equals(userId)) {
            throw new RuntimeException("Bạn không thể chỉnh sửa Payment của người khác.");
        }
    } 
    
    else if (!"ROLE_ADMIN".equalsIgnoreCase(role) && !"ROLE_STAFF".equalsIgnoreCase(role)) {
        throw new RuntimeException("Không có quyền thực hiện thao tác này.");
    }

    if (dto.getAmount() != null && dto.getAmount() <= 0) {
        throw new IllegalArgumentException("Số tiền phải lớn hơn 0.");
    }

    // ✅ Cho phép cập nhật
    return paymentService.updatePayment(paymentId, dto);
}

    
    @DeleteMapping("/{paymentId}")
    public void deletePayment(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long paymentId) {

        checkRole(role, "ADMIN");
        paymentService.deletePayment(paymentId);
    }
   
}


