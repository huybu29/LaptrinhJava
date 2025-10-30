package project.repo.controllers;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import project.repo.dtos.PaymentDto;
import project.repo.service.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Validated
public class PaymentController {

    private final PaymentService paymentService;

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

        return paymentService.getPaymentByUserID(userID);
    }

    // 🔹 Tạo thanh toán (CUSTOMER, STAFF, ADMIN)
    @PostMapping("/")
    public PaymentDto createPayment(
            @RequestHeader("X-User-Role") String role,
            @RequestBody PaymentDto dto) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return paymentService.createPayment(dto);
    }
     @GetMapping("/me")
    public List<PaymentDto> geMytPayment(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long currentUserId
           ) {

        return paymentService.getPaymentByUserID(currentUserId);
   }
   @PutMapping("/{paymentId}")
    public PaymentDto updatePayment(
        @RequestHeader("X-User-Role") String role,
        @PathVariable Long paymentId,
        @RequestBody PaymentDto dto) {

    checkRole(role, "STAFF", "ADMIN");
    return paymentService.updatePayment(paymentId, dto);
}
}
