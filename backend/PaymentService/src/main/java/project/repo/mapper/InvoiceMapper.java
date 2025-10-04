package project.repo.mapper;
import org.mapstruct.Mapper;
import project.repo.entity.Invoice;
import project.repo.dtos.InvoiceDto;
@Mapper(componentModel = "spring")
public interface InvoiceMapper {
  InvoiceDto toDto(Invoice invoice);
  Invoice toEntity(InvoiceDto dto);
}
