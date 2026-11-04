package com.inquiro.tracker.inquiry;

public class InquiryNotFoundException extends RuntimeException {
    public InquiryNotFoundException(String message) {
        super(message);
    }
}
