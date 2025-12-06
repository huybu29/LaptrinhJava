package project.repo.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.repo.dtos.PlanSubscriptionDTO;
import project.repo.service.PlanSubscriptionService;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
public class PlanSubscriptionController {
     private void checkRole(String roleHeader, String... allowedRoles) {
        for (String role : allowedRoles) {
            if (roleHeader != null && roleHeader.equalsIgnoreCase("ROLE_" + role)) {
                return;
            }
        }
        throw new RuntimeException("Access denied: required role " + String.join(", ", allowedRoles));
    }
    private final PlanSubscriptionService PlanSubscriptionService;

    @PostMapping
   
    public ResponseEntity<PlanSubscriptionDTO> createPlan(@RequestBody PlanSubscriptionDTO planDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(PlanSubscriptionService.createPlan(planDTO));
    }

    @PutMapping("/{id}")
   
    public ResponseEntity<PlanSubscriptionDTO> updatePlan(
            @PathVariable Long id,
            @RequestBody PlanSubscriptionDTO planDTO) {
        return ResponseEntity.ok(PlanSubscriptionService.updatePlan(id, planDTO));
    }

    @GetMapping("/{id}")
   
    public ResponseEntity<PlanSubscriptionDTO> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(PlanSubscriptionService.getPlanById(id));
    }

    @GetMapping
 
    public ResponseEntity<List<PlanSubscriptionDTO>> getAllPlans() {
        return ResponseEntity.ok(PlanSubscriptionService.getAllPlans());
    }

    @GetMapping("/active")
   
    public ResponseEntity<List<PlanSubscriptionDTO>> getActivePlans() {
        return ResponseEntity.ok(PlanSubscriptionService.getActivePlans());
    }

    @DeleteMapping("/{id}")
  
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        PlanSubscriptionService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
  
    public ResponseEntity<PlanSubscriptionDTO> togglePlanStatus(@PathVariable Long id) {
        return ResponseEntity.ok(PlanSubscriptionService.togglePlanStatus(id));
    }
    
}