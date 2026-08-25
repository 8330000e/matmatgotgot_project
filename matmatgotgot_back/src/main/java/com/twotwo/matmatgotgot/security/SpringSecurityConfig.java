package com.twotwo.matmatgotgot.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // 👈 추가
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
            // 1. CORS 설정 적용
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. CSRF 비활성화
            .csrf(csrf -> csrf.disable())
            
            // 3. 기본 세션/폼 로그인 비활성화
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // 4. URL별 접근 권한 설정
            .authorizeHttpRequests(authorize -> authorize
                // ⭐ 루트 경로(/) 및 static/error 리소스 허용 (403 해결)
                .requestMatchers("/", "/error", "/favicon.ico").permitAll()
                .requestMatchers("/upload/**", "/api/upload/**").permitAll()
                
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
                
                // 그 외 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )
            
            // ⭐ JWT 인증 필터 등록 (UsernamePasswordAuthenticationFilter 앞에 배치)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCrypt() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://d2lg74d5mqmhqe.cloudfront.net",
                "http://ec2-15-165-96-13.ap-northeast-2.compute.amazonaws.com"
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        config.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}