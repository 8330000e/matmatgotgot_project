package com.twotwo.matmatgotgot.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
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
            // 1. CORS 설정 적용 (리액트 브라우저 접근 허용)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. CSRF 비활성화 (REST API 환경이므로 꺼둡니다)
            .csrf(csrf -> csrf.disable())
            
            // 3. 기본 세션/폼 로그인 비활성화 (JWT를 사용할 것이므로 불필요한 기본 창 해제)
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // 4. URL별 접근 권한 설정
            .authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/error", "/favicon.ico").permitAll()
            .requestMatchers("/upload/**", "/api/upload/**").permitAll()
            
            # ⭐ /api/ 프리픽스를 추가하여 리액트 프록시 요청과 일치시킵니다.
            .requestMatchers("/members/**", "/api/members/**", "/login", "/api/login").permitAll()
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
    );
        return http.build();
    }

    // 💡 비밀번호 암호화 객체 (회원가입 비즈니스 로직 시 필수)
    @Bean
    public BCryptPasswordEncoder bCrypt() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // 1. allowedOrigins 대신 allowedOriginPatterns 사용 (권장)
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://d2lg74d5mqmhqe.cloudfront.net",
                "http://ec2-15-165-96-13.ap-northeast-2.compute.amazonaws.com"
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // 2. AllowedHeaders를 하나로 통일
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        
        // 3. allowCredentials는 한 번만 설정
        config.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
