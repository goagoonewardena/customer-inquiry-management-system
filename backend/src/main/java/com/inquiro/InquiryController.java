package com.inquiro;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class InquiryController {
    private static final List<String> STATUSES = List.of("New", "In Progress", "Resolved");
    private final JdbcTemplate jdbcTemplate;

    public InquiryController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        return Map.of("status", "ok", "message", "Inquiro Tracker API is running", "database", "connected");
    }

    @GetMapping("/inquiries")
    public List<Inquiry> list() {
        return jdbcTemplate.query("""
                SELECT id, customer, contact, subject, description, status,
                       TO_CHAR(created_at, 'YYYY-MM-DD') AS date
                FROM inquiries ORDER BY created_at DESC
                """, (rs, rowNum) -> new Inquiry(rs.getInt("id"), rs.getString("customer"),
                rs.getString("contact"), rs.getString("subject"), rs.getString("description"),
                rs.getString("status"), rs.getString("date")));
    }

    @PostMapping("/inquiries")
    @ResponseStatus(HttpStatus.CREATED)
    public Inquiry create(@Valid @RequestBody CreateInquiry request) {
        return jdbcTemplate.queryForObject("""
                INSERT INTO inquiries (customer, contact, subject, description)
                VALUES (?, ?, ?, ?)
                RETURNING id, customer, contact, subject, description, status,
                          TO_CHAR(created_at, 'YYYY-MM-DD') AS date
                """, (rs, rowNum) -> new Inquiry(rs.getInt("id"), rs.getString("customer"),
                rs.getString("contact"), rs.getString("subject"), rs.getString("description"),
                rs.getString("status"), rs.getString("date")),
                request.customer(), request.contact(), request.subject(), request.description());
    }

    @PatchMapping("/inquiries/{id}/status")
    public Inquiry updateStatus(@PathVariable int id, @RequestBody StatusUpdate request) {
        if (id <= 0 || !STATUSES.contains(request.status())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid inquiry ID and status are required.");
        }
        List<Inquiry> results = jdbcTemplate.query("""
                UPDATE inquiries SET status = ? WHERE id = ?
                RETURNING id, customer, contact, subject, description, status,
                          TO_CHAR(created_at, 'YYYY-MM-DD') AS date
                """, (rs, rowNum) -> new Inquiry(rs.getInt("id"), rs.getString("customer"),
                rs.getString("contact"), rs.getString("subject"), rs.getString("description"),
                rs.getString("status"), rs.getString("date")), request.status(), id);
        if (results.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inquiry not found.");
        }
        return results.get(0);
    }

    public record Inquiry(int id, String customer, String contact, String subject,
                          String description, String status, String date) {}

    public record StatusUpdate(String status) {}

    public record CreateInquiry(
            @NotBlank @Size(max = 100) String customer,
            @NotBlank @Size(max = 150) String contact,
            @NotBlank @Size(max = 200) String subject,
            @NotBlank @Size(max = 2000) String description) {}
}
