package com.twotwo.global.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.twotwo.matmatgotgot.member.*.mapper")  // Mapper 인터페이스 자동 스캔
public class MyBatisConfig {
    
}
