package com.twotwo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. CORS 설정 적용 (리액트 브라우저 접근 허용)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. CSRF 비활성화 (REST API 환경이므로 꺼둡니다)
            .csrf(csrf -> csrf.disable())
            
            // 3. 기본 세션/폼 로그인 비활성화 (JWT를 사용할 것이므로 불필요한 기본 창 해제)
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            
            // 4. URL별 접근 권한 설정
            .authorizeHttpRequests(auth -> auth
                // 회원가입, 로그인 등 인증이 필요 없는 주소는 완전히 허용
                .requestMatchers("/members", "/members/**").permitAll() 
                // 그 외 모든 요청은 기본적으로 인증(로그인)을 받도록 설정
                // 💡 개발 단계에서 전부 허용하고 싶다면 아래 authenticated()를 permitAll()로 바꾸시면 됩니다.
                .anyRequest().authenticated() 
            );

        return http.build();
    }

    // 💡 비밀번호 암호화 객체 (회원가입 비즈니스 로직 시 필수)
    @Bean
    public BCryptPasswordEncoder bCrypt() {
        return new BCryptPasswordEncoder();
    }

    // 💡 리액트(5173 포트) 연동을 위한 CORS 세부 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowedOrigins(List.of("http://localhost:5173")); // 프론트엔드 주소 허용
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 인증 헤더(토큰, 쿠키 등)를 허용할 때 필수

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 모든 URL 경로에 위의 CORS 설정 적용
        return source;
    }
}