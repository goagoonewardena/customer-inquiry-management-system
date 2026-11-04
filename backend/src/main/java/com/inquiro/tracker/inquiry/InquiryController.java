package com.inquiro.tracker.inquiry;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {
    private final InquiryService service;

    public InquiryController(InquiryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Inquiry> getInquiries(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String status
    ) {
        return service.findAll(search, status);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Inquiry createInquiry(@Valid @RequestBody CreateInquiryRequest request) {
        return service.create(request);
    }

    @PatchMapping("/{id}/status")
    public Inquiry updateStatus(
            @PathVariable int id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        if (id <= 0) {
            throw new InvalidInquiryException("A valid inquiry ID is required.");
        }
        return service.updateStatus(id, request.status());
    }
}
