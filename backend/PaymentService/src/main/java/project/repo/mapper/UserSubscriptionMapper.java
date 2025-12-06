package project.repo.mapper;

import project.repo.entity.*;
import project.repo.dtos.*;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface UserSubscriptionMapper {
 UserSubscriptionDTO toDto(UserSubscription userSubscription);
 UserSubscription toEntity(UserSubscriptionDTO userSubscriptionDto);
}
  

