package com.twotwo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.root}")
    private String root;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 에디터 이미지
        registry
                .addResourceHandler("/editor/**")
                .addResourceLocations("file:///" + root + "editor/");

        // 회원 프로필 이미지
        registry
                .addResourceHandler("/member/thumb/**")
                .addResourceLocations("file:///" + root + "member/");
    }
}