package project.repo.mapper;

import project.repo.entity.Payment;
import project.repo.dtos.PaymentDto;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface PaymentMapper {
 PaymentDto toDto(Payment payment);
 Payment toEntity(PaymentDto paymentDto);
}
  

