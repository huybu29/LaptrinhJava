package project.repo.controllers;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project.repo.dtos.InvoiceDto;
import project.repo.service.InvoiceService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {
  private final InvoiceService
  invoiceService;
  @GetMapping("/")
  public List<InvoiceDto> getAllInvoice(){
    return invoiceService.getAllInvoice();
    
  }
  @GetMapping("/{invoiceID}")
  public List<InvoiceDto> getInvoiceByID(@PathVariable Long invoiceID){
    return invoiceService.getInvoiceByID(invoiceID);
    
  }
  @PostMapping("/")
  public InvoiceDto createInvoice(@RequestBody InvoiceDto dto) {

      return invoiceService.createInvoice(dto);
  }
  @PatchMapping("/{invoiceID}")
  public InvoiceDto updateInvoice(@PathVariable Long invoiceID, @RequestBody InvoiceDto dto) {
    dto.setInvoiceID(invoiceID);
    return invoiceService.createInvoice(dto);
  }
}
