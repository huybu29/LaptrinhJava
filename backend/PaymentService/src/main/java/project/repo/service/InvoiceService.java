package project.repo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;
import project.repo.mapper.*;
import lombok.RequiredArgsConstructor;
import project.repo.repository.InvoiceRepository;
import project.repo.dtos.*;
import project.repo.entity.*;

import java.util.List;
@RestController
@Service
@RequiredArgsConstructor
public class InvoiceService {
  private final InvoiceRepository invoiceRepository;
  private final InvoiceMapper invoiceMapper;
  private final PaymentMapper paymentMapper;
  private final PaymentService paymentService;
  public List<InvoiceDto> getAllInvoice(){
    return invoiceRepository.findAll().stream().map(invoice->invoiceMapper.toDto(invoice)).toList();
  }
  public List<InvoiceDto> getInvoiceByID(Long invoiceID){
    return List.of(invoiceMapper.toDto(invoiceRepository.findById(invoiceID).orElse(null)));
  }
  public InvoiceDto createInvoice(InvoiceDto dto){
    InvoiceDto invoice = invoiceMapper.toDto(invoiceRepository.save(invoiceMapper.toEntity(dto)));
    
    return invoice;
}
  
}