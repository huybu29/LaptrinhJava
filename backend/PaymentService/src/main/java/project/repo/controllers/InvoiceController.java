package project.repo.controllers;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import project.repo.dtos.InvoiceDto;
import project.repo.service.InvoiceService;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

    private final InvoiceService invoiceService;

    // 🔹 Helper kiểm tra role
    private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }

    // 🔹 Lấy tất cả hóa đơn (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/")
    public List<InvoiceDto> getAllInvoice(@RequestHeader("X-User-Role") String role) {
        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return invoiceService.getAllInvoice();
    }

    // 🔹 Lấy hóa đơn theo ID (CUSTOMER, STAFF, ADMIN)
    @GetMapping("/{invoiceID}")
    public List<InvoiceDto> getInvoiceByID(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long invoiceID) {

        checkRole(role, "CUSTOMER", "STAFF", "ADMIN");
        return invoiceService.getInvoiceByID(invoiceID);
    }

    // 🔹 Tạo hóa đơn (chỉ STAFF, ADMIN)
    @PostMapping("/")
    public InvoiceDto createInvoice(
            @RequestHeader("X-User-Role") String role,
            @RequestBody InvoiceDto dto) {

        checkRole(role, "STAFF", "ADMIN");
        return invoiceService.createInvoice(dto);
    }

    // 🔹 Cập nhật hóa đơn (chỉ STAFF, ADMIN)
    @PatchMapping("/{invoiceID}")
    public InvoiceDto updateInvoice(
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long invoiceID,
            @RequestBody InvoiceDto dto) {

        checkRole(role, "STAFF", "ADMIN");
        dto.setInvoiceID(invoiceID);
        return invoiceService.createInvoice(dto);
    }
}
