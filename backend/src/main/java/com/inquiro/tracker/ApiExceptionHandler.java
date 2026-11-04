package com.inquiro.tracker;

import com.inquiro.tracker.inquiry.InquiryNotFoundException;
import com.inquiro.tracker.inquiry.InvalidInquiryException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(MethodArgumentNotValidException exception) {
        return Map.of(
                "message", "Invalid inquiry data.",
                "errors", exception.getBindingResult().getFieldErrors().stream()
                        .map(error -> Map.of("field", error.getField(), "message", error.getDefaultMessage()))
                        .collect(Collectors.toList())
        );
    }

    @ExceptionHandler(InvalidInquiryException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleInvalidInquiry(InvalidInquiryException exception) {
        return Map.of("message", exception.getMessage());
    }

    @ExceptionHandler(InquiryNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(InquiryNotFoundException exception) {
        return Map.of("message", exception.getMessage());
    }
}
