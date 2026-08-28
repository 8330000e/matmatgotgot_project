package com.twotwo.matmatgotgot.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class JwtAuthFilter extends GenericFilter {

    @Value("${jwt.secret}")
    private String secretKey;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;

        // 💡 1. [CORS 핵심] Preflight (OPTIONS) 요청은 토큰 검증 없이 무조건 통과
        if ("OPTIONS".equalsIgnoreCase(httpServletRequest.getMethod())) {
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            chain.doFilter(request, response);
            return;
        }

        String requestURI = httpServletRequest.getRequestURI();
        log.info("Request URI = {}", requestURI);

        // 💡 2. [/api context-path 대응] 토큰 검증이 필요 없는 공개 경로 우회
        if (requestURI.contains("/members/login") || 
            requestURI.contains("/members/signup") || 
            requestURI.contains("/login/kakao") ||
            requestURI.contains("/oauth2/")) {
            chain.doFilter(request, response);
            return;
        }

        String token = parseBearerToken(httpServletRequest);
        if (token == null) {
            chain.doFilter(request, response);
            return;
        }

        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        
        // 토큰 검증 및 claims 추출
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String memberId = claims.getSubject();

            List<GrantedAuthority> authorities = new ArrayList<>();
            UserDetails userDetails = new User(memberId, "", authorities);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, "",
                    userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
        } catch (Exception e) {
            log.error("JWT 검증 실패: {}", e.getMessage());
            httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpServletResponse.setContentType("application/json;charset=UTF-8");
            httpServletResponse.getWriter().write("{\"message\":\"토큰이 만료되었거나 유효하지 않습니다.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}