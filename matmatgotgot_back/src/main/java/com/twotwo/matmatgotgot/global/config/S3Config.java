package com.twotwo.matmatgotgot.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.services.s3.S3Client;

import javax.swing.plaf.synth.Region;

@Configuration
public class S3Config {

    // application.properties 의 cloud.aws.credentials.access-key 값 주입
    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    // application.properties 의 cloud.aws.credentials.secret-key 값 주입
    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    // application.properties 의 cloud.aws.region.static 값 주입 (예: ap-northeast-2)
    @Value("${cloud.aws.region.static}")
    private String region;

    /**
     * AWS S3Client 빈 생성
     * - StaticCredentialsProvider: access-key / secret-key 를 고정값으로 인증
     * - Region.of(region): ap-northeast-2(서울) 등 설정한 리전으로 연결
     * - 생성된 빈은 FileUtil 에서 이미지 업로드/삭제에 사용됨
     */
    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        )
                )
                .build();
    }
}

