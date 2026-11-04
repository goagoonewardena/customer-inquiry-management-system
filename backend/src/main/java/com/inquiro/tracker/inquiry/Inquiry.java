package com.inquiro.tracker.inquiry;

import java.time.LocalDate;

public record Inquiry(
        int id,
        String customer,
        String contact,
        String subject,
        String description,
        String status,
        LocalDate date
) {
}
