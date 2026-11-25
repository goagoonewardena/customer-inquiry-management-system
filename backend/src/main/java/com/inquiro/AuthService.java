package com.inquiro;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private static final String SESSION_COOKIE = "INQUIRO_SESSION";
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();
    private final String dummyPasswordHash;

    public AuthService(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
        this.dummyPasswordHash = passwordEncoder.encode(UUID.randomUUID().toString());
    }

    public AuthenticatedSession register(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        validatePasswordLength(password);

        try {
            Integer userId = jdbcTemplate.queryForObject("""
                    INSERT INTO staff_users (email, password_hash, approved)
                    VALUES (?, ?, TRUE)
                    RETURNING id
                    """, Integer.class, normalizedEmail, passwordEncoder.encode(password));
            if (userId == null) {
                throw new IllegalStateException("The database did not return the new staff account ID.");
            }
            return createSession(new StaffUser(userId, normalizedEmail));
        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "An account with this email already exists.");
        }
    }

    public AuthenticatedSession login(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        List<Credential> credentials = jdbcTemplate.query("""
                SELECT id, email, password_hash
                FROM staff_users
                WHERE LOWER(email) = ? AND approved = TRUE
                """, (resultSet, rowNumber) -> mapCredential(resultSet), normalizedEmail);

        if (credentials.isEmpty()) {
            passwordEncoder.matches(password, dummyPasswordHash);
            throw invalidCredentials();
        }

        Credential credential = credentials.get(0);
        if (!passwordEncoder.matches(password, credential.passwordHash())) {
            throw invalidCredentials();
        }
        return createSession(new StaffUser(credential.id(), credential.email()));
    }

    public Optional<StaffUser> findSessionUser(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        List<StaffUser> users = jdbcTemplate.query("""
                SELECT u.id, u.email
                FROM staff_sessions s
                JOIN staff_users u ON u.id = s.user_id
                WHERE s.token_hash = ?
                  AND s.expires_at > CURRENT_TIMESTAMP
                  AND u.approved = TRUE
                """, (resultSet, rowNumber) ->
                new StaffUser(resultSet.getInt("id"), resultSet.getString("email")),
                hashToken(token));
        return users.stream().findFirst();
    }

    public void revokeSession(String token) {
        if (token != null && !token.isBlank()) {
            jdbcTemplate.update("DELETE FROM staff_sessions WHERE token_hash = ?", hashToken(token));
        }
    }

    public static String sessionCookieName() {
        return SESSION_COOKIE;
    }

    private AuthenticatedSession createSession(StaffUser user) {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);

        jdbcTemplate.update("DELETE FROM staff_sessions WHERE expires_at <= CURRENT_TIMESTAMP");
        jdbcTemplate.update("""
                INSERT INTO staff_sessions (token_hash, user_id, expires_at)
                VALUES (?, ?, CURRENT_TIMESTAMP + INTERVAL '8 hours')
                """, hashToken(token), user.id());
        return new AuthenticatedSession(user, token);
    }

    private void validatePasswordLength(String password) {
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must be no more than 72 bytes.");
        }
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
    }

    private static String hashToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }

    private static Credential mapCredential(ResultSet resultSet) throws SQLException {
        return new Credential(
                resultSet.getInt("id"),
                resultSet.getString("email"),
                resultSet.getString("password_hash"));
    }

    public record AuthenticatedSession(StaffUser user, String token) {}

    private record Credential(int id, String email, String passwordHash) {}
}
