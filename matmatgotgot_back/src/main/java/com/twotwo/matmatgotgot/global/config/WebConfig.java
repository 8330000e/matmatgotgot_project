package com.twotwo.matmatgotgot.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//이미지를 브라우저에 보여주기 위한 설정
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${file.root}")
    private String root;

    @Override
        public void addCorsMappings(CorsRegistry registry) {
                // allowCredentials(true)를 사용할 때는 allowedOrigins("*")를 사용할 수 없습니다.
                // 브라우저는 자격 증명 포함 응답에서 Access-Control-Allow-Origin을 '*'로 설정하는 것을 허용하지 않습니다.
                // 따라서 명시적 origin 목록이나 allowedOriginPatterns를 사용해야 합니다.
                registry.addMapping("**")
                .allowedOrigins("https://d2lg74d5mqmhqe.cloudfront.net", "http://ec2-15-165-96-13.ap-northeast-2.compute.amazonaws.com")
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
        String finalLocation = "file:" + root + "member/";

        //에디터 이미지
        registry
                .addResourceHandler("/editor/**")
                .addResourceLocations("file:///" + root + "editor/");    //실제경로

        //회원 프로필 이미지
        registry.addResourceHandler("/upload/**")
                .addResourceLocations(finalLocation);
    
        registry
                .addResourceHandler("/restaurants/**")	// 요청 패턴
                .addResourceLocations("file:///" + root + "restaurant/");	// 실제 경로

                
        registry.addResourceHandler("/menu/**")
                .addResourceLocations("file:///" + root + "menu/");

    }
}
