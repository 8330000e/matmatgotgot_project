package com.twotwo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. CORS 설정 적용 (Security 필터 앞단에서 허용 처리)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. CSRF 비활성화 (REST API 환경이므로 꺼둡니다)
            .csrf(csrf -> csrf.disable())
            
            // 3. 302 리다이렉트 원인 해결 (특정 URL 접근 허용)
            .authorizeHttpRequests(auth -> auth
                // 프론트엔드에서 요청하는 /members 및 하위 주소들은 로그인 없이 무조건 통과!
                .requestMatchers("/members", "/members/**").permitAll() 
                // 그 외의 API 요청도 개발 단계에서는 일단 다 열어두고 싶다면 아래 주석을 풀고 .anyRequest().permitAll()을 쓰세요.
                .anyRequest().authenticated() 
            );

        return http.build();
    }

    // CORS 세부 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowedOrigins(List.of("http://localhost:5173")); // 프론트엔드 주소 허용
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 쿠키나 인증 헤더를 허용할 때 필수

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 모든 URL 경로에 CORS 설정 적용
        return source;
    }
}