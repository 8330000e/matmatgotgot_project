package com.twotwo.matmatgotgot.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct; // 추가 (초기화용)

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKeyString;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey secretKey;

    // 객체 생성 후 문자열 키를 실제 SecretKey 객체로 변환
    @PostConstruct
    protected void init() {
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    // // 토큰 생성
    public String createToken(String memberId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(memberId)                    // setSubject -> subject
                .issuedAt(now)
                .expiration(validity)                // setExpiration -> expiration
                .signWith(secretKey)                 // Keys.hmacShaKeyFor를 매번 호출하지 않고 변수 사용
                .compact();
    }

    // // 토큰에서 memberId 추출
    public String getMemberId(String token) {
        return Jwts.parser()                         // parserBuilder() -> parser()
                .verifyWith(secretKey)               // setSigningKey() -> verifyWith()
                .build()
                .parseSignedClaims(token)            // parseClaimsJws() -> parseSignedClaims()
                .getPayload()                        // getBody() -> getPayload()
                .getSubject();
    }

    // // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}