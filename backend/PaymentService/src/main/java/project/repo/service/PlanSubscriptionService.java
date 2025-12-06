package project.repo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.PlanSubscriptionDTO;
import project.repo.entity.PlanSubscription;
import project.repo.mapper.PlanSubscriptionMapper;
import project.repo.repository.PlanSubscriptionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PlanSubscriptionService {

    private final PlanSubscriptionRepository planRepository;
    private final PlanSubscriptionMapper planMapper;

    public PlanSubscriptionDTO createPlan(PlanSubscriptionDTO planDTO) {
        log.info("Creating new subscription plan: {}", planDTO.getName());
        
        // Check duplicate name
        if (isPlanNameExists(planDTO.getName())) {
            log.error("Plan name already exists: {}", planDTO.getName());
            throw new RuntimeException("Tên gói đã tồn tại: " + planDTO.getName());
        }
        
        // Build entity
        PlanSubscription plan = buildPlanEntity(planDTO);
        
        // Save to database
        PlanSubscription savedPlan = planRepository.save(plan);
        log.info("Subscription plan created successfully with ID: {}", savedPlan.getId());
        
        return planMapper.toDto(savedPlan);
    }

    public PlanSubscriptionDTO updatePlan(Long id, PlanSubscriptionDTO planDTO) {
        log.info("Updating subscription plan with ID: {}", id);
        
        // Find existing plan
        PlanSubscription existingPlan = findPlanById(id);
        
        // Check duplicate name (exclude current plan)
        if (isPlanNameExistsExcludingId(planDTO.getName(), id)) {
            log.error("Plan name already exists: {}", planDTO.getName());
            throw new RuntimeException("Tên gói đã tồn tại: " + planDTO.getName());
        }
        
        // Update entity
        updatePlanEntity(existingPlan, planDTO);
        
        // Save changes
        PlanSubscription updatedPlan = planRepository.save(existingPlan);
        log.info("Subscription plan updated successfully");
        
        return planMapper.toDto(updatedPlan);
    }

    @Transactional(readOnly = true)
    public PlanSubscriptionDTO getPlanById(Long id) {
        log.info("Fetching subscription plan with ID: {}", id);
        
        PlanSubscription plan = findPlanById(id);
        return planMapper.toDto(plan);
    }

    @Transactional(readOnly = true)
    public List<PlanSubscriptionDTO> getAllPlans() {
        log.info("Fetching all subscription plans");
        
        List<PlanSubscription> plans = planRepository.findAll();
        
        if (plans.isEmpty()) {
            log.warn("No subscription plans found");
        }
        
        return plans.stream()
                .map(planMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlanSubscriptionDTO> getActivePlans() {
        log.info("Fetching active subscription plans");
        
        List<PlanSubscription> activePlans = planRepository.findAll().stream()
                .filter(PlanSubscription::isActive)
                .collect(Collectors.toList());
        
        if (activePlans.isEmpty()) {
            log.warn("No active subscription plans found");
        }
        
        return activePlans.stream()
                .map(planMapper::toDto)
                .collect(Collectors.toList());
    }

    public void deletePlan(Long id) {
        log.info("Deleting subscription plan with ID: {}", id);
        
        // Check if plan exists
        PlanSubscription plan = findPlanById(id);
        
        // Business logic: Check if plan can be deleted
        if (isPlanInUse(id)) {
            log.error("Cannot delete plan in use: {}", id);
            throw new RuntimeException("Không thể xóa gói đang được sử dụng");
        }
        
        // Delete plan
        planRepository.deleteById(id);
        log.info("Subscription plan deleted successfully");
    }

    public PlanSubscriptionDTO togglePlanStatus(Long id) {
        log.info("Toggling status for subscription plan with ID: {}", id);
        
        // Find plan
        PlanSubscription plan = findPlanById(id);
        
        // Toggle status
        boolean newStatus = !plan.isActive();
        plan.setActive(newStatus);
        
        // Save changes
        PlanSubscription updatedPlan = planRepository.save(plan);
        
        log.info("Plan status toggled to: {}", updatedPlan.isActive());
        return planMapper.toDto(updatedPlan);
    }

    // ==================== PRIVATE HELPER METHODS ====================
    
    private PlanSubscription findPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Plan not found with ID: {}", id);
                    return new RuntimeException("Không tìm thấy gói với ID: " + id);
                });
    }
    
    private boolean isPlanNameExists(String name) {
        return planRepository.findAll().stream()
                .anyMatch(plan -> plan.getName().equalsIgnoreCase(name.trim()));
    }
    
    private boolean isPlanNameExistsExcludingId(String name, Long excludeId) {
        return planRepository.findAll().stream()
                .anyMatch(plan -> !plan.getId().equals(excludeId) 
                        && plan.getName().equalsIgnoreCase(name.trim()));
    }
    
    private boolean isPlanInUse(Long planId) {
        // TODO: Implement logic to check if plan is being used by any user
        // Example: return userSubscriptionRepository.existsByPlanId(planId);
        return false; // Placeholder
    }
    
    private PlanSubscription buildPlanEntity(PlanSubscriptionDTO planDTO) {
        return PlanSubscription.builder()
                .name(planDTO.getName().trim())
                .description(planDTO.getDescription())
                .priceMonthly(planDTO.getPriceMonthly())
                .priceYearly(planDTO.getPriceYearly())
                .swapLimit(planDTO.getSwapLimit())
                .isActive(planDTO.isActive())
               
                .build();
    }
    
    private void updatePlanEntity(PlanSubscription existingPlan, PlanSubscriptionDTO planDTO) {
        existingPlan.setName(planDTO.getName().trim());
        existingPlan.setDescription(planDTO.getDescription());
        existingPlan.setPriceMonthly(planDTO.getPriceMonthly());
        existingPlan.setPriceYearly(planDTO.getPriceYearly());
        existingPlan.setSwapLimit(planDTO.getSwapLimit());
        existingPlan.setActive(planDTO.isActive());
       
    }
}