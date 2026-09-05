package com.twotwo.matmatgotgot.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SpringSecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

   @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 💡 1. CORS 설정 빈 연결
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/", "/error", "/favicon.ico").permitAll()
                .requestMatchers("/upload/**", "/api/upload/**").permitAll()
                
                .requestMatchers("/api/members/login", "/api/members/join", "/api/members/check-id").permitAll()
                // 소셜 로그인 관련
                .requestMatchers("/login/**", "/oauth2/**", "/api/login/**", "/api/oauth2/**").permitAll()
                .requestMatchers("/login/oauth2/code/**", "/api/login/oauth2/code/**").permitAll()
                
                // 도메인 API 허용
                .requestMatchers("/members/**", "/api/members/**", "/login", "/api/login", "/members/pwMember", "/members/memberno", "/members/natives").permitAll()
                .requestMatchers("/boards/**", "/api/boards/**").permitAll()
                .requestMatchers("/editor/**", "/api/editor/**").permitAll()
                .requestMatchers("/restaurants/**", "/api/restaurants/**").permitAll()
                .requestMatchers("/api/naver/**").permitAll()
                .requestMatchers("/admin/**", "/api/admin/**").permitAll()
                .requestMatchers("/trips/**", "/api/trips/**").permitAll()
                .requestMatchers("/menu/**", "/api/menu/**").permitAll()
                .requestMatchers("/api/route/**").permitAll()
                .requestMatchers("/main/**", "/api/main/**").permitAll()
                
                .anyRequest().authenticated()
            )
            // 💡 2. JwtAuthFilter가 실행되기 전 CorsFilter가 먼저 처리되도록 설정
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder bCrypt() {
        return org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://d2lg74d5mqmhqe.cloudfront.net",
                "http://ec2-15-165-96-13.ap-northeast-2.compute.amazonaws.com"
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*")); // ⭐ 모든 요청 헤더 허용
        config.setExposedHeaders(List.of("Authorization", "Set-Cookie")); // ⭐ 프론트에서 토큰/쿠키 접근 가능하도록 노출
        config.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}