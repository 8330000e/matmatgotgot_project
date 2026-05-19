package com.twotwo.global.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

// 날짜 관련 공통 유틸. 여러 도메인에서 공통으로 쓰는 메서드만 위치
public class DateUtils {

    private DateUtils() {}  // 인스턴스 생성 금지

    public static String format(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public static boolean isPast(LocalDateTime dateTime) {
        return dateTime.isBefore(LocalDateTime.now());
    }
}