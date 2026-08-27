package com.twotwo.matmatgotgot.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.root}")
    private String root;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                        "https://d2lg74d5mqmhqe.cloudfront.net",
                        "http://ec2-15-165-96-13.ap-northeast-2.compute.amazonaws.com",
                        "http://localhost:5173", "http://127.0.0.1:5173",
                        "http://localhost:3000", "http://127.0.0.1:3000",
                        "http://localhost:9999"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // file: 프로토콜 안전하게 보정 (file:/path/to/dir/ 형태)
        String basePath = root.startsWith("file:") ? root : "file:" + root;
        if (!basePath.endsWith("/")) {
            basePath += "/";
        }

        // 에디터 이미지
        registry.addResourceHandler("/editor/**")
                .addResourceLocations(basePath + "editor/");

        // 회원 프로필 이미지
        registry.addResourceHandler("/upload/**")
                .addResourceLocations(basePath + "member/");

        // 맛집 이미지
        registry.addResourceHandler("/restaurants/**")
                .addResourceLocations(basePath + "restaurant/");

        // 메뉴 이미지 (/api/menu/basic.jpeg -> file:${root}/menu/basic.jpeg)
        registry.addResourceHandler("/menu/**")
                .addResourceLocations(basePath + "menu/");
    }
}