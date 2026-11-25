package com.inquiro;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

class StaffAuthenticationFilterTest {
    @Test
    void rejectsHttpRequestsWhenHttpsIsRequiredEvenWithUntrustedForwardedHeader()
            throws Exception {
        AuthService authService = mock(AuthService.class);
        StaffAuthenticationFilter filter =
                new StaffAuthenticationFilter(authService, true, Set.of("10.0.0.2"));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/auth/login");
        request.setRemoteAddr("203.0.113.8");
        request.addHeader("X-Forwarded-Proto", "https");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertEquals(426, response.getStatus());
        verifyNoInteractions(authService);
    }

    @Test
    void acceptsHttpsForwardedByConfiguredProxy() throws Exception {
        AuthService authService = mock(AuthService.class);
        StaffAuthenticationFilter filter =
                new StaffAuthenticationFilter(authService, true, Set.of("10.0.0.2"));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/health");
        request.setRemoteAddr("10.0.0.2");
        request.addHeader("X-Forwarded-Proto", "https");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertNotNull(chain.getRequest());
        assertEquals(200, response.getStatus());
    }
}
