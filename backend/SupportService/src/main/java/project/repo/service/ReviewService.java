package project.repo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.repo.dtos.ReviewDTO;
import project.repo.entity.Review;
import project.repo.mapper.ReviewMapper;
import project.repo.repository.ReviewRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    public ReviewDTO createReview(ReviewDTO dto) {
        log.info("Creating review for station: {} by user: {}", dto.getStationId(), dto.getUserId());
        
        // Check if swap already has review
        if (isSwapAlreadyReviewed(dto.getPaymentId())) {
            log.error("Swap already has review: {}", dto.getPaymentId());
            throw new RuntimeException("Giao dịch này đã được đánh giá");
        }
        
        // Check rating range
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            log.error("Invalid rating: {}", dto.getRating());
            throw new RuntimeException("Đánh giá phải từ 1 đến 5 sao");
        }
        
        // Build entity
        Review review = buildReviewEntity(dto);
        
        // Save to database
        Review savedReview = reviewRepository.save(review);
        log.info("Review created successfully with ID: {}", savedReview.getId());
        
        return reviewMapper.toDto(savedReview);
    }

    public ReviewDTO updateReview(Long id, ReviewDTO dto) {
        log.info("Updating review with ID: {}", id);
        
        // Find existing review
        Review existingReview = findReviewById(id);
        
        // Check rating range
        if (dto.getRating() < 1 || dto.getRating() > 5) {
            log.error("Invalid rating: {}", dto.getRating());
            throw new RuntimeException("Đánh giá phải từ 1 đến 5 sao");
        }
        
        // Update entity
        updateReviewEntity(existingReview, dto);
        
        // Save changes
        Review updatedReview = reviewRepository.save(existingReview);
        log.info("Review updated successfully");
        
        return reviewMapper.toDto(updatedReview);
    }

    @Transactional(readOnly = true)
    public ReviewDTO getReviewById(Long id) {
        log.info("Fetching review with ID: {}", id);
        
        Review review = findReviewById(id);
        return reviewMapper.toDto(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getAllReviews() {
        log.info("Fetching all reviews");
        
        List<Review> reviews = reviewRepository.findAll();
        
        if (reviews.isEmpty()) {
            log.warn("No reviews found");
        }
        
        return reviews.stream()
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByStationId(Long stationId) {
        log.info("Fetching reviews for station: {}", stationId);
        
        List<Review> reviews = reviewRepository.findAll().stream()
                .filter(review -> review.getStationId().equals(stationId))
                .collect(Collectors.toList());
        
        if (reviews.isEmpty()) {
            log.warn("No reviews found for station: {}", stationId);
        }
        
        return reviews.stream()
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByUserId(Long userId) {
        log.info("Fetching reviews by user: {}", userId);
        
        List<Review> reviews = reviewRepository.findAll().stream()
                .filter(review -> review.getUserId().equals(userId))
                .collect(Collectors.toList());
        
        if (reviews.isEmpty()) {
            log.warn("No reviews found for user: {}", userId);
        }
        
        return reviews.stream()
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReviewDTO getReviewByPaymentId(Long paymentId) {
        log.info("Fetching review for swap: {}", paymentId);
        
        Review review = reviewRepository.findAll().stream()
                .filter(r -> r.getPaymentId().equals(paymentId))
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Review not found for swap: {}", paymentId);
                    return new RuntimeException("Không tìm thấy đánh giá cho giao dịch: " + paymentId);
                });
        
        return reviewMapper.toDto(review);
    }

    @Transactional(readOnly = true)
    public Double getAverageRatingByStationId(Long stationId) {
        log.info("Calculating average rating for station: {}", stationId);
        
        List<Review> reviews = reviewRepository.findAll().stream()
                .filter(review -> review.getStationId().equals(stationId))
                .collect(Collectors.toList());
        
        if (reviews.isEmpty()) {
            log.warn("No reviews found for station: {}", stationId);
            return 0.0;
        }
        
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        log.info("Average rating for station {}: {}", stationId, average);
        return average;
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByRating(Integer rating) {
        log.info("Fetching reviews with rating: {}", rating);
        
        if (rating < 1 || rating > 5) {
            log.error("Invalid rating: {}", rating);
            throw new RuntimeException("Đánh giá phải từ 1 đến 5 sao");
        }
        
        List<Review> reviews = reviewRepository.findAll().stream()
                .filter(review -> review.getRating().equals(rating))
                .collect(Collectors.toList());
        
        if (reviews.isEmpty()) {
            log.warn("No reviews found with rating: {}", rating);
        }
        
        return reviews.stream()
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

    public void deleteReview(Long id) {
        log.info("Deleting review with ID: {}", id);
        
        // Check if review exists
        Review review = findReviewById(id);
        
        // Delete review
        reviewRepository.deleteById(id);
        log.info("Review deleted successfully");
    }

    // ==================== PRIVATE HELPER METHODS ====================
    
    private Review findReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Review not found with ID: {}", id);
                    return new RuntimeException("Không tìm thấy đánh giá với ID: " + id);
                });
    }
    
    private boolean isSwapAlreadyReviewed(Long paymentId) {
        return reviewRepository.findAll().stream()
                .anyMatch(review -> review.getPaymentId().equals(paymentId));
    }
    
    private Review buildReviewEntity(ReviewDTO dto) {
        return Review.builder()
                .userId(dto.getUserId())
                .stationId(dto.getStationId())
                .paymentId(dto.getPaymentId())
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();
    }
    
    private void updateReviewEntity(Review review, ReviewDTO dto) {
        if (dto.getRating() != null) {
            review.setRating(dto.getRating());
        }
        if (dto.getComment() != null) {
            review.setComment(dto.getComment());
        }
    }
}