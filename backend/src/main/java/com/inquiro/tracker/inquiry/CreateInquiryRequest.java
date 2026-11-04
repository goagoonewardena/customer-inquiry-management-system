package com.inquiro.tracker.inquiry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateInquiryRequest(
        @NotBlank @Size(max = 100) String customer,
        @NotBlank @Size(max = 150) String contact,
        @NotBlank @Size(max = 200) String subject,
        @NotBlank @Size(max = 2000) String description
) {
}
