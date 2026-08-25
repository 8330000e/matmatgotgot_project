package com.twotwo.matmatgotgot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController { // 👈 이름 변경

    @GetMapping("/")
    public String healthCheck() {
        return "Matmatgotgot API Server is running!";
    }
}