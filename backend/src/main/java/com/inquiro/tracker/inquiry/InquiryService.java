package com.inquiro.tracker.inquiry;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class InquiryService {
    private static final Set<String> ALLOWED_STATUSES = Set.of("New", "In Progress", "Resolved");
    private final InquiryRepository repository;

    public InquiryService(InquiryRepository repository) {
        this.repository = repository;
    }

    public List<Inquiry> findAll(String search, String status) {
        if (status != null && !status.isBlank() && !ALLOWED_STATUSES.contains(status)) {
            throw new InvalidInquiryException("A valid status is required.");
        }
        return repository.findAll(search, status);
    }

    public Inquiry create(CreateInquiryRequest request) {
        return repository.create(request);
    }

    public Inquiry updateStatus(int id, String status) {
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new InvalidInquiryException("A valid status is required.");
        }
        return repository.updateStatus(id, status)
                .orElseThrow(() -> new InquiryNotFoundException("Inquiry not found."));
    }
}
