package com.inquiro;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {
    private JdbcTemplate jdbcTemplate;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        authService = new AuthService(jdbcTemplate, passwordEncoder);
    }

    @Test
    void registerNormalizesEmailHashesPasswordAndCreatesSession() {
        when(jdbcTemplate.queryForObject(
                anyString(), eq(Integer.class), eq("staff@example.com"), eq("encoded-password")))
                .thenReturn(7);
        when(jdbcTemplate.update(anyString())).thenReturn(0);
        when(jdbcTemplate.update(anyString(), anyString(), eq(7))).thenReturn(1);

        AuthService.AuthenticatedSession session =
                authService.register(" Staff@Example.com ", "password123");

        assertEquals("staff@example.com", session.user().email());
        assertEquals(7, session.user().id());
        assertFalse(session.token().isBlank());
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void registerRejectsPasswordsThatExceedBcryptByteLimit() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register("staff@example.com", "é".repeat(37)));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertTrue(exception.getReason().contains("72 bytes"));
    }
}
