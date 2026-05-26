package com.twotwo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.twotwo.matmatgotgot.member.mapper")
public class MatmatgotgotApplication {

	public static void main(String[] args) {
		SpringApplication.run(MatmatgotgotApplication.class, args);
	}

}
