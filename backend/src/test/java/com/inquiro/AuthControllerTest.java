package com.inquiro;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthControllerTest {
    @Test
    void signupIsDisabledWhenInvitationCodeIsNotConfigured() {
        AuthService authService = mock(AuthService.class);
        AuthController controller = new AuthController(authService);
        ReflectionTestUtils.setField(controller, "signupInviteCode", "");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> controller.signup(
                        new AuthController.SignupRequest(
                                "staff@example.com", "password123", "invite"),
                        new MockHttpServletResponse()));

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
        verify(authService, never()).register(anyString(), anyString());
    }

    @Test
    void signupRejectsAnInvalidInvitationCode() {
        AuthController controller = new AuthController(mock(AuthService.class));
        ReflectionTestUtils.setField(controller, "signupInviteCode", "valid-invite");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> controller.signup(
                        new AuthController.SignupRequest(
                                "staff@example.com", "password123", "wrong-invite"),
                        new MockHttpServletResponse()));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void signupSetsSecureHttpOnlySessionCookieWhenConfigured() {
        AuthService authService = mock(AuthService.class);
        when(authService.register("staff@example.com", "password123"))
                .thenReturn(new AuthService.AuthenticatedSession(
                        new StaffUser(4, "staff@example.com"), "session-token"));
        AuthController controller = new AuthController(authService);
        ReflectionTestUtils.setField(controller, "signupInviteCode", "valid-invite");
        ReflectionTestUtils.setField(controller, "secureCookie", true);
        MockHttpServletResponse response = new MockHttpServletResponse();

        controller.signup(
                new AuthController.SignupRequest(
                        "staff@example.com", "password123", "valid-invite"),
                response);

        String cookie = response.getHeader("Set-Cookie");
        assertTrue(cookie.contains("; Secure"));
        assertTrue(cookie.contains("HttpOnly"));
    }
}
