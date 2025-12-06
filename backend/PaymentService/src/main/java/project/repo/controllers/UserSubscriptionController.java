package project.repo.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.UserSubscriptionDTO;
import project.repo.service.UserSubscriptionService;

import java.util.List;

@RestController
@RequestMapping("/api/user-subscriptions")
@RequiredArgsConstructor

public class UserSubscriptionController {

    private final UserSubscriptionService userSubscriptionService;
     private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }
    @PostMapping
   
    public ResponseEntity<UserSubscriptionDTO> createSubscription(@RequestBody UserSubscriptionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userSubscriptionService.createSubscription(dto));
    }

    @PutMapping("/{id}")
    
    public ResponseEntity<UserSubscriptionDTO> updateSubscription(
            @PathVariable Long id,
            @RequestBody UserSubscriptionDTO dto) {
        return ResponseEntity.ok(userSubscriptionService.updateSubscription(id, dto));
    }

    @GetMapping("/{id}")
    
    public ResponseEntity<UserSubscriptionDTO> getSubscriptionById(@PathVariable Long id) {
        return ResponseEntity.ok(userSubscriptionService.getSubscriptionById(id));
    }

    @GetMapping
   
    public ResponseEntity<List<UserSubscriptionDTO>> getAllSubscriptions() {
        return ResponseEntity.ok(userSubscriptionService.getAllSubscriptions());
    }

    @GetMapping("/user/{userId}")
  
    public ResponseEntity<List<UserSubscriptionDTO>> getSubscriptionsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userSubscriptionService.getSubscriptionsByUserId(userId));
    }

    @GetMapping("/active")
  
    public ResponseEntity<List<UserSubscriptionDTO>> getActiveSubscriptions() {
        return ResponseEntity.ok(userSubscriptionService.getActiveSubscriptions());
    }

    @PatchMapping("/{id}/cancel")
 
    public ResponseEntity<UserSubscriptionDTO> cancelSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(userSubscriptionService.cancelSubscription(id));
    }

    @PatchMapping("/{id}/renew")
 
    public ResponseEntity<UserSubscriptionDTO> renewSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(userSubscriptionService.renewSubscription(id));
    }
    @GetMapping("/me")
    public ResponseEntity<List<UserSubscriptionDTO>> getMySubscriptions(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

  
        checkRole(role, "CUSTOMER");
        return ResponseEntity.ok(userSubscriptionService.getSubscriptionsByUserId(userId));
    }
}