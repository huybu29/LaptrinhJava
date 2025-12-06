package project.repo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.UserSubscriptionDTO;
import project.repo.entity.PlanSubscription;
import project.repo.entity.UserSubscription;
import project.repo.entity.UserSubscription.BillingCycle;
import project.repo.entity.UserSubscription.SubscriptionStatus;
import project.repo.mapper.UserSubscriptionMapper;
import project.repo.repository.UserSubscriptionRepository;
import project.repo.repository.PlanSubscriptionRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserSubscriptionService {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final PlanSubscriptionRepository planRepository;
    private final UserSubscriptionMapper userSubscriptionMapper;

    public UserSubscriptionDTO createSubscription(UserSubscriptionDTO dto) {
        log.info("Creating subscription for user: {}", dto.getUserId());
        
        // Find plan
        PlanSubscription plan = findPlanById(dto.getPlanId());
        
        // Check if plan is active
        if (!plan.isActive()) {
            log.error("Plan is not active: {}", dto.getPlanId());
            throw new RuntimeException("Gói đăng ký không còn hoạt động");
        }
        
        // Check if user already has active subscription
        if (hasActiveSubscription(dto.getUserId())) {
            log.error("User already has active subscription: {}", dto.getUserId());
            throw new RuntimeException("Người dùng đã có gói đăng ký đang hoạt động");
        }
        
        // Build entity
        UserSubscription subscription = buildSubscriptionEntity(dto, plan);
        
        // Save to database
        UserSubscription savedSubscription = userSubscriptionRepository.save(subscription);
        log.info("Subscription created successfully with ID: {}", savedSubscription.getId());
        
        return mapToDTO(savedSubscription);
    }

    public UserSubscriptionDTO updateSubscription(Long id, UserSubscriptionDTO dto) {
        log.info("Updating subscription with ID: {}", id);
        
        // Find existing subscription
        UserSubscription existingSubscription = findSubscriptionById(id);
        
        // Update fields
        updateSubscriptionEntity(existingSubscription, dto);
        
        // Save changes
        UserSubscription updatedSubscription = userSubscriptionRepository.save(existingSubscription);
        log.info("Subscription updated successfully");
        
        return mapToDTO(updatedSubscription);
    }

    @Transactional(readOnly = true)
    public UserSubscriptionDTO getSubscriptionById(Long id) {
        log.info("Fetching subscription with ID: {}", id);
        
        UserSubscription subscription = findSubscriptionById(id);
        return mapToDTO(subscription);
    }

    @Transactional(readOnly = true)
    public List<UserSubscriptionDTO> getAllSubscriptions() {
        log.info("Fetching all subscriptions");
        
        List<UserSubscription> subscriptions = userSubscriptionRepository.findAll();
        
        if (subscriptions.isEmpty()) {
            log.warn("No subscriptions found");
        }
        
        return subscriptions.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserSubscriptionDTO> getSubscriptionsByUserId(Long userId) {
        log.info("Fetching subscriptions for user: {}", userId);
        
        List<UserSubscription> subscriptions = userSubscriptionRepository.findAll().stream()
                .filter(sub -> sub.getUserId().equals(userId))
                .collect(Collectors.toList());
        
        if (subscriptions.isEmpty()) {
            log.warn("No subscriptions found for user: {}", userId);
        }
        
        return subscriptions.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserSubscriptionDTO> getActiveSubscriptions() {
        log.info("Fetching active subscriptions");
        
        List<UserSubscription> activeSubscriptions = userSubscriptionRepository.findAll().stream()
                .filter(sub -> sub.getStatus() == SubscriptionStatus.ACTIVE)
                .collect(Collectors.toList());
        
        if (activeSubscriptions.isEmpty()) {
            log.warn("No active subscriptions found");
        }
        
        return activeSubscriptions.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserSubscriptionDTO cancelSubscription(Long id) {
        log.info("Cancelling subscription with ID: {}", id);
        
        // Find subscription
        UserSubscription subscription = findSubscriptionById(id);
        
        // Check if already cancelled
        if (subscription.getStatus() == SubscriptionStatus.CANCELLED) {
            log.error("Subscription already cancelled: {}", id);
            throw new RuntimeException("Gói đăng ký đã bị hủy trước đó");
        }
        
        // Update status
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setAutoRenewal(false);
        
        // Save changes
        UserSubscription cancelledSubscription = userSubscriptionRepository.save(subscription);
        log.info("Subscription cancelled successfully");
        
        return mapToDTO(cancelledSubscription);
    }

    public UserSubscriptionDTO renewSubscription(Long id) {
        log.info("Renewing subscription with ID: {}", id);
        
        // Find subscription
        UserSubscription subscription = findSubscriptionById(id);
        
        // Check if can be renewed
        if (subscription.getStatus() == SubscriptionStatus.ACTIVE) {
            log.error("Subscription is already active: {}", id);
            throw new RuntimeException("Gói đăng ký đang hoạt động");
        }
        
        // Calculate new dates
        LocalDateTime newStartDate = LocalDateTime.now();
        LocalDateTime newEndDate = calculateEndDate(newStartDate, subscription.getBillingCycle());
        
        // Update subscription
        subscription.setStartDate(newStartDate);
        subscription.setEndDate(newEndDate);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setSwapsUsed(0); // Reset swaps used
        
        // Save changes
        UserSubscription renewedSubscription = userSubscriptionRepository.save(subscription);
        log.info("Subscription renewed successfully");
        
        return mapToDTO(renewedSubscription);
    }

    public UserSubscriptionDTO incrementSwapUsage(Long id) {
        log.info("Incrementing swap usage for subscription: {}", id);
        
        // Find subscription
        UserSubscription subscription = findSubscriptionById(id);
        
        // Check if subscription is active
        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            log.error("Subscription is not active: {}", id);
            throw new RuntimeException("Gói đăng ký không hoạt động");
        }
        
        // Check if swap limit reached
        if (subscription.getSwapsUsed() >= subscription.getSwapLimitSnapshot()) {
            log.error("Swap limit reached for subscription: {}", id);
            throw new RuntimeException("Đã đạt giới hạn số lần đổi pin");
        }
        
        // Increment swap usage
        subscription.setSwapsUsed(subscription.getSwapsUsed() + 1);
        
        // Save changes
        UserSubscription updatedSubscription = userSubscriptionRepository.save(subscription);
        log.info("Swap usage incremented. Current: {}/{}", 
                updatedSubscription.getSwapsUsed(), 
                updatedSubscription.getSwapLimitSnapshot());
        
        return mapToDTO(updatedSubscription);
    }

    public void deleteSubscription(Long id) {
        log.info("Deleting subscription with ID: {}", id);
        
        // Check if subscription exists
        UserSubscription subscription = findSubscriptionById(id);
        
        // Delete subscription
        userSubscriptionRepository.deleteById(id);
        log.info("Subscription deleted successfully");
    }

    public void checkAndUpdateExpiredSubscriptions() {
        log.info("Checking for expired subscriptions");
        
        LocalDateTime now = LocalDateTime.now();
        List<UserSubscription> activeSubscriptions = userSubscriptionRepository.findAll().stream()
                .filter(sub -> sub.getStatus() == SubscriptionStatus.ACTIVE)
                .filter(sub -> sub.getEndDate().isBefore(now))
                .collect(Collectors.toList());
        
        for (UserSubscription subscription : activeSubscriptions) {
            subscription.setStatus(SubscriptionStatus.EXPIRED);
            userSubscriptionRepository.save(subscription);
            log.info("Subscription {} marked as expired", subscription.getId());
        }
        
        log.info("Expired {} subscriptions", activeSubscriptions.size());
    }

    // ==================== PRIVATE HELPER METHODS ====================
    
    private UserSubscription findSubscriptionById(Long id) {
        return userSubscriptionRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Subscription not found with ID: {}", id);
                    return new RuntimeException("Không tìm thấy gói đăng ký với ID: " + id);
                });
    }
    
    private PlanSubscription findPlanById(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> {
                    log.error("Plan not found with ID: {}", planId);
                    return new RuntimeException("Không tìm thấy gói với ID: " + planId);
                });
    }
    
    private boolean hasActiveSubscription(Long userId) {
        return userSubscriptionRepository.findAll().stream()
                .anyMatch(sub -> sub.getUserId().equals(userId) 
                        && sub.getStatus() == SubscriptionStatus.ACTIVE);
    }
    
    private UserSubscription buildSubscriptionEntity(UserSubscriptionDTO dto, PlanSubscription plan) {
        BillingCycle billingCycle = BillingCycle.valueOf(dto.getBillingCycle().toUpperCase());
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = calculateEndDate(startDate, billingCycle);
        BigDecimal price = calculatePrice(plan, billingCycle);
        
        return UserSubscription.builder()
                .userId(dto.getUserId())
                .planId(dto.getPlanId())
                .billingCycle(billingCycle)
                .startDate(startDate)
                .endDate(endDate)
                .status(SubscriptionStatus.ACTIVE)
                .swapsUsed(0)
                .swapLimitSnapshot(plan.getSwapLimit())
                .autoRenewal(true)
                .purchasePrice(price)
                .build();
    }
    
    private void updateSubscriptionEntity(UserSubscription subscription, UserSubscriptionDTO dto) {
        if (dto.getBillingCycle() != null) {
            subscription.setBillingCycle(BillingCycle.valueOf(dto.getBillingCycle().toUpperCase()));
        }
    }
    
    private LocalDateTime calculateEndDate(LocalDateTime startDate, BillingCycle billingCycle) {
        return billingCycle == BillingCycle.MONTHLY 
                ? startDate.plusMonths(1) 
                : startDate.plusYears(1);
    }
    
    private BigDecimal calculatePrice(PlanSubscription plan, BillingCycle billingCycle) {
        return billingCycle == BillingCycle.MONTHLY 
                ? plan.getPriceMonthly() 
                : plan.getPriceYearly();
    }
    
    private UserSubscriptionDTO mapToDTO(UserSubscription subscription) {
        return UserSubscriptionDTO.builder()
                .id(subscription.getId())
                .userId(subscription.getUserId())
                .planId(subscription.getPlanId())
                .billingCycle(subscription.getBillingCycle().name())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .status(subscription.getStatus().name())
                .swapsUsed(subscription.getSwapsUsed())
                .swapLimitSnapshot(subscription.getSwapLimitSnapshot())
                .purchasePrice(subscription.getPurchasePrice())
                .build();
    }
}