package project.repo.repository;
import project.repo.entity.Invoice;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
  List<Invoice> findByInvoiceID(Long invoiceID);
}