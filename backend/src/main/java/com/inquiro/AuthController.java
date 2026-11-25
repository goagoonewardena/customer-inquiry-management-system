package com.inquiro;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Duration SESSION_TTL = Duration.ofHours(8);
    private final AuthService authService;

    @Value("${app.auth.cookie-secure}")
    private boolean secureCookie;

    @Value("${app.auth.invite-code:}")
    private String signupInviteCode;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse signup(
            @Valid @RequestBody SignupRequest request,
            HttpServletResponse response) {
        verifyInviteCode(request.inviteCode());
        AuthService.AuthenticatedSession session =
                authService.register(request.email(), request.password());
        setSessionCookie(response, session.token(), SESSION_TTL);
        return UserResponse.from(session.user());
    }

    @PostMapping("/login")
    public UserResponse login(
            @Valid @RequestBody Credentials request,
            HttpServletResponse response) {
        AuthService.AuthenticatedSession session =
                authService.login(request.email(), request.password());
        setSessionCookie(response, session.token(), SESSION_TTL);
        return UserResponse.from(session.user());
    }

    @GetMapping("/me")
    public UserResponse currentUser(@AuthenticationPrincipal StaffUser user) {
        return UserResponse.from(user);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String token = readSessionToken(request);
        authService.revokeSession(token);
        setSessionCookie(response, "", Duration.ZERO);
    }

    private void setSessionCookie(HttpServletResponse response, String token, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(AuthService.sessionCookieName(), token)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/api")
                .maxAge(maxAge)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    private void verifyInviteCode(String providedCode) {
        if (signupInviteCode.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Staff signup is disabled until an invitation code is configured.");
        }
        if (!MessageDigest.isEqual(
                signupInviteCode.getBytes(StandardCharsets.UTF_8),
                providedCode.getBytes(StandardCharsets.UTF_8))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid staff invitation code.");
        }
    }

    private static String readSessionToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        return Arrays.stream(cookies)
                .filter(cookie -> AuthService.sessionCookieName().equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    public record Credentials(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 72) String password) {}

    public record SignupRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @NotBlank @Size(max = 256) String inviteCode) {}

    public record UserResponse(int id, String email) {
        static UserResponse from(StaffUser user) {
            return new UserResponse(user.id(), user.email());
        }
    }
}
