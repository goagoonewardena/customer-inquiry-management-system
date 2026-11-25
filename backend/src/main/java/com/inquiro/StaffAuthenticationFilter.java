package com.inquiro;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

public class StaffAuthenticationFilter extends OncePerRequestFilter {
    private final AuthService authService;
    private final boolean requireHttps;
    private final Set<String> trustedProxyAddresses;

    public StaffAuthenticationFilter(
            AuthService authService,
            boolean requireHttps,
            Set<String> trustedProxyAddresses) {
        this.authService = authService;
        this.requireHttps = requireHttps;
        this.trustedProxyAddresses = trustedProxyAddresses;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        if (requireHttps
                && request.getRequestURI().startsWith("/api/")
                && !isSecureRequest(request)) {
            response.setStatus(HttpStatus.UPGRADE_REQUIRED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"message\":\"HTTPS is required.\"}");
            return;
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            Arrays.stream(cookies)
                    .filter(cookie -> AuthService.sessionCookieName().equals(cookie.getName()))
                    .findFirst()
                    .flatMap(cookie -> authService.findSessionUser(cookie.getValue()))
                    .ifPresent(user -> SecurityContextHolder.getContext().setAuthentication(
                            new UsernamePasswordAuthenticationToken(
                                    user, null, List.of(new SimpleGrantedAuthority("ROLE_STAFF")))));
        }

        filterChain.doFilter(request, response);
    }

    private boolean isSecureRequest(HttpServletRequest request) {
        if (request.isSecure()) {
            return true;
        }
        return trustedProxyAddresses.contains(request.getRemoteAddr())
                && "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
    }
}
