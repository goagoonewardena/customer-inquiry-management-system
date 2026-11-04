package com.inquiro.tracker.inquiry;

import jakarta.validation.constraints.NotBlank;

public record UpdateStatusRequest(@NotBlank String status) {
}
