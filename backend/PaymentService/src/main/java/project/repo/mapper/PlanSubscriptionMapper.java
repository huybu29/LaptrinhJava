package project.repo.mapper;

import project.repo.entity.*;
import project.repo.dtos.*;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface PlanSubscriptionMapper {
 PlanSubscriptionDTO toDto(PlanSubscription planSubscription);
 PlanSubscription toEntity(PlanSubscriptionDTO planSubscriptionDto);
}
  

