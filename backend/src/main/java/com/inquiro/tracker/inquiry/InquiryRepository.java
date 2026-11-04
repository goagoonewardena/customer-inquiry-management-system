package com.inquiro.tracker.inquiry;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class InquiryRepository {
    private final JdbcTemplate jdbcTemplate;

    public InquiryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Inquiry> findAll(String search, String status) {
        String searchTerm = search == null ? "" : search.trim().toLowerCase();
        String selectedStatus = status == null ? "" : status.trim();

        return jdbcTemplate.query(
                """
                SELECT id, customer, contact, subject, description, status,
                       created_at::date AS date
                FROM inquiries
                WHERE (
                    LOWER(customer) LIKE ? OR LOWER(contact) LIKE ?
                    OR LOWER(subject) LIKE ? OR CAST(id AS TEXT) LIKE ?
                )
                AND (? = '' OR status = ?)
                ORDER BY created_at DESC
                """,
                this::mapRow,
                "%" + searchTerm + "%",
                "%" + searchTerm + "%",
                "%" + searchTerm + "%",
                "%" + searchTerm + "%",
                selectedStatus,
                selectedStatus
        );
    }

    public Inquiry create(CreateInquiryRequest request) {
        return jdbcTemplate.queryForObject(
                """
                INSERT INTO inquiries (customer, contact, subject, description)
                VALUES (?, ?, ?, ?)
                RETURNING id, customer, contact, subject, description, status,
                          created_at::date AS date
                """,
                this::mapRow,
                request.customer().trim(),
                request.contact().trim(),
                request.subject().trim(),
                request.description().trim()
        );
    }

    public Optional<Inquiry> updateStatus(int id, String status) {
        return jdbcTemplate.query(
                """
                UPDATE inquiries
                SET status = ?
                WHERE id = ?
                RETURNING id, customer, contact, subject, description, status,
                          created_at::date AS date
                """,
                this::mapRow,
                status,
                id
        ).stream().findFirst();
    }

    private Inquiry mapRow(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Inquiry(
                resultSet.getInt("id"),
                resultSet.getString("customer"),
                resultSet.getString("contact"),
                resultSet.getString("subject"),
                resultSet.getString("description"),
                resultSet.getString("status"),
                resultSet.getObject("date", java.time.LocalDate.class)
        );
    }
}
