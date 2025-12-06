package project.repo.mapper;

import project.repo.entity.Review;
import project.repo.dtos.ReviewDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    ReviewDTO toDto(Review review);
    Review toEntity(ReviewDTO reviewDTO);
}