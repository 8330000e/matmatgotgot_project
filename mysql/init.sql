SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- 1. 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS matgotdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE matgotdb;

CREATE TABLE `member_tbl` (
`member_no`              BIGINT   NOT NULL AUTO_INCREMENT,
`member_id`       VARCHAR(50)       NOT NULL,
`member_pw`       CHAR(60)          NOT NULL,
`member_name`     VARCHAR(30)       NOT NULL,
`member_email`    VARCHAR(50)       NOT NULL,
`member_nickname` VARCHAR(20)       NOT NULL,
`member_thumb`    VARCHAR(255)      NULL,
`member_address`  VARCHAR(300)  NULL,
`member_status`   TINYINT UNSIGNED  NOT NULL DEFAULT 0 COMMENT '0:정상/1:비정상',
`enroll_date`     DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
`admin`           BOOLEAN           NOT NULL DEFAULT 0 COMMENT '0:일반회원/1:관리자',
lat                                DOUBLE,
lng                                DOUBLE,
`ad_content`        TINYINT UNSIGNED        NULL        DEFAULT 0        COMMENT '0:수신비동의/1:메일수신동의/2.문자수신동의/3:이메일문자수신종의',
PRIMARY KEY (`member_no`),
UNIQUE KEY `UQ_MEMBER_ID`       (`member_id`),
UNIQUE KEY `UQ_MEMBER_EMAIL`    (`member_email`),
UNIQUE KEY `UQ_MEMBER_NICKNAME` (`member_nickname`)
);

CREATE TABLE `natives_tbl` (
`native_no`       BIGINT       NOT NULL AUTO_INCREMENT,
`member_id`       VARCHAR(20)  NULL,
`region`          VARCHAR(50)  NOT NULL COMMENT '시도 시군구 동면읍',
`native_deadline` DATETIME     NULL COMMENT 'NULL이면 제한 없음',
PRIMARY KEY (`native_no`),
INDEX `idx_member_id` (`member_id`),
CONSTRAINT `fk_natives_member`
FOREIGN KEY (`member_id`)
REFERENCES `member_tbl` (`member_id`)
ON DELETE SET NULL
ON UPDATE CASCADE
);

CREATE TABLE `login_log_tbl` (
`login_no`      BIGINT           NOT NULL AUTO_INCREMENT,
`member_no`     BIGINT           NULL,
`login_status`  TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0:로그아웃/1:로그인',
`login_time`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`login_no`),
INDEX `idx_member_no` (`member_no`),
CONSTRAINT `fk_login_member`
FOREIGN KEY (`member_no`)
REFERENCES `member_tbl` (`member_no`)
ON DELETE SET NULL
ON UPDATE CASCADE
);

CREATE TABLE `social_login_tbl` (
`social_no`     BIGINT    NOT NULL AUTO_INCREMENT,
`member_no`     BIGINT    NULL,
`social_google` DATETIME  NULL,
`social_kakao`  DATETIME  NULL,
`social_naver`  DATETIME  NULL,
`social_apple`  DATETIME  NULL,
PRIMARY KEY (`social_no`),
INDEX `idx_member_no` (`member_no`),
CONSTRAINT `fk_social_member`
FOREIGN KEY (`member_no`)
REFERENCES `member_tbl` (`member_no`)
ON DELETE SET NULL
ON UPDATE CASCADE
);

CREATE TABLE `restaurant_tbl` (
    `rest_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `member_id` VARCHAR(50) NOT NULL,
    `rest_name` VARCHAR(100) NOT NULL,
    `rest_addr` VARCHAR(255) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20),
    `hours` VARCHAR(100),
    `rating_sum` INT NOT NULL DEFAULT 0,
    `review_total_count` INT NOT NULL DEFAULT 0,
    `local_review_count` INT NOT NULL DEFAULT 0,
    `rest_content` TEXT NOT NULL,
    `ai_review` TEXT,
    `rest_status` VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    `rest_thumb` varchar(300),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `uk_same_restaurant` 
    UNIQUE (`rest_name`, `rest_addr`),

    CONSTRAINT `fk_restaurant_writer`
    FOREIGN KEY (`member_id`) REFERENCES `member_tbl`(`member_id`) ON DELETE CASCADE
);

CREATE TABLE `rest_report_tbl` (
    `rest_rp_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `member_id` VARCHAR(50) NOT NULL,
    `rest_no` BIGINT NOT NULL,
    `reason` VARCHAR(50) NOT NULL CHECK (`reason` IN ('허위정보', '욕설비방', '광고스팸', '기타')),
    `detail` TEXT,
    `report_status` TINYINT NOT NULL DEFAULT 0 CHECK (`report_status` IN (0, 1, 2)),
    `report_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_rest_report_member`
        FOREIGN KEY (`member_id`)
        REFERENCES `member_tbl` (`member_id`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_report_restaurant`
        FOREIGN KEY (`rest_no`)
        REFERENCES `restaurant_tbl` (`rest_no`)
        ON DELETE CASCADE,

    CONSTRAINT `uk_report_unique_rest`
        UNIQUE (`member_id`, `rest_no`)
);

CREATE TABLE `rest_like_tbl` (
    `member_id` VARCHAR(50) NOT NULL,
    `rest_no` BIGINT NOT NULL,

    CONSTRAINT `pk_like_rest`
    PRIMARY KEY (`member_id`, `rest_no`),

    CONSTRAINT `fk_like_member`
    FOREIGN KEY (`member_id`) REFERENCES `member_tbl`(`member_id`) ON DELETE CASCADE,

    CONSTRAINT `fk_like_restaurant`
    FOREIGN KEY (`rest_no`) REFERENCES `restaurant_tbl`(`rest_no`) ON DELETE CASCADE
);

CREATE TABLE `review_tbl` (
    `review_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `member_id` VARCHAR(50) NOT NULL,
    `rest_no` BIGINT NOT NULL,
    `review_content` TEXT NOT NULL,
    `rating` TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `visit_date` DATE NOT NULL,
    `is_local_review` BOOLEAN NOT NULL DEFAULT FALSE,
    `review_status` TINYINT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_review_member` 
    FOREIGN KEY (`member_id`) REFERENCES `member_tbl`(`member_id`) ON DELETE CASCADE,

    CONSTRAINT `fk_review_restaurant`
    FOREIGN KEY (`rest_no`) REFERENCES `restaurant_tbl`(`rest_no`) ON DELETE CASCADE
);

CREATE TABLE `review_menu_tbl` (
    `review_menu_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `review_no` BIGINT NOT NULL,
    `menu_name` VARCHAR(100) NOT NULL,
    
    CONSTRAINT `uk_review_menu`
    UNIQUE (`review_no`, `menu_name`),

    CONSTRAINT `fk_review_menu_review`
    FOREIGN KEY (`review_no`) REFERENCES `review_tbl`(`review_no`) ON DELETE CASCADE
);

CREATE TABLE `review_tags_tbl`(
    `review_tags_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `review_no` BIGINT NOT NULL,
    `tag_name` VARCHAR(30) NOT NULL,

    CONSTRAINT `uq_review_tag`
    UNIQUE (`review_no`, `tag_name`),

    CONSTRAINT `fk_review_tags_tbl_review`
    FOREIGN KEY (`review_no`) REFERENCES `review_tbl`(`review_no`) ON DELETE CASCADE
);

CREATE TABLE `review_images_tbl` (
    `review_image_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `review_no` BIGINT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,

    CONSTRAINT `fk_review_image`
    FOREIGN KEY (`review_no`) REFERENCES `review_tbl`(`review_no`) ON DELETE CASCADE
);

CREATE TABLE `review_like_tbl`(
    `review_no` BIGINT NOT NULL,
    `member_id` VARCHAR(50) NOT NULL,
    
    CONSTRAINT `pk_like_review`
    PRIMARY KEY (`review_no`, `member_id`),

    CONSTRAINT `fk_review_like_member`
    FOREIGN KEY (`member_id`) REFERENCES `member_tbl`(`member_id`) ON DELETE CASCADE,

    CONSTRAINT `fk_review_like_review`
    FOREIGN KEY (`review_no`) REFERENCES `review_tbl`(`review_no`) ON DELETE CASCADE
);

CREATE TABLE `review_report_tbl` (
    `review_rp_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `member_id` VARCHAR(50) NOT NULL,
    `review_no` BIGINT NOT NULL,
    `reason` VARCHAR(50) NOT NULL CHECK (`reason` IN ('허위정보', '욕설비방', '광고스팸', '기타')),
    `detail` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `report_status` TINYINT NOT NULL DEFAULT 0 CHECK (`report_status` IN (0, 1, 2)),

    CONSTRAINT `fk_review_report_review`
        FOREIGN KEY (`review_no`)
        REFERENCES `review_tbl` (`review_no`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_review_report_member`
        FOREIGN KEY (`member_id`)
        REFERENCES `member_tbl` (`member_id`)
        ON DELETE CASCADE,

    CONSTRAINT `uk_review_report`
        UNIQUE (`member_id`, `review_no`)
);

CREATE TABLE `review_comment_tbl` (
    `comment_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `review_no` BIGINT NOT NULL,
    `member_id` VARCHAR(50) NOT NULL,
    `parent_comment` BIGINT,
    `depth` TINYINT UNSIGNED NOT NULL DEFAULT 0 CHECK (`depth` IN (0,1)),
    `content` TEXT NOT NULL,
    `com_status` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT `fk_review_comment_review`
    FOREIGN KEY (`review_no`) REFERENCES `review_tbl`(`review_no`) ON DELETE CASCADE,

    CONSTRAINT `fk_review_comment_member`
    FOREIGN KEY (`member_id`) REFERENCES `member_tbl`(`member_id`) ON DELETE CASCADE,

    CONSTRAINT `fk_review_comment_parent`
    FOREIGN KEY (`parent_comment`) REFERENCES `review_comment_tbl`(`comment_no`) ON DELETE CASCADE
);

CREATE TABLE `review_comment_report_tbl` (
    `review_com_rp_no` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `member_id` VARCHAR(50) NOT NULL,
    `comment_no` BIGINT NOT NULL,
    `reason` VARCHAR(50) NOT NULL CHECK (`reason` IN ('허위정보', '욕설비방', '광고스팸', '기타')),
    `detail` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `report_status` TINYINT NOT NULL DEFAULT 0 CHECK (`report_status` IN (0, 1, 2)),

    CONSTRAINT `fk_report_com_member`
        FOREIGN KEY (`member_id`)
        REFERENCES `member_tbl` (`member_id`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_report_com_comment`
        FOREIGN KEY (`comment_no`)
        REFERENCES `review_comment_tbl` (`comment_no`)
        ON DELETE CASCADE,

    CONSTRAINT `uk_report_unique_comment`
        UNIQUE (`member_id`, `comment_no`)
);

CREATE TABLE `board_place_tbl` (
    `place_no` BIGINT NOT NULL AUTO_INCREMENT,
    `place_name` VARCHAR(150) NOT NULL,
    `address_name` VARCHAR(260) NOT NULL,
    `place_lat` DOUBLE NULL,
    `place_lng` DOUBLE NULL,

    PRIMARY KEY (`place_no`),

    UNIQUE KEY `uq_place` (
        `place_name`,
        `address_name`
    )
);

CREATE TABLE `board_tbl` (
    `board_no` BIGINT NOT NULL AUTO_INCREMENT,
    `member_no` BIGINT NOT NULL,
    `board_category` INT NOT NULL,
    `board_title` VARCHAR(150) NOT NULL,
    `board_content` MEDIUMTEXT NOT NULL,
    `board_thumb` VARCHAR(500) NULL,
    `board_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `board_status` TINYINT NOT NULL DEFAULT 1,
    `place_no` BIGINT NOT NULL,
    `board_view` BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (`board_no`),

    CONSTRAINT `fk_board_member`
    FOREIGN KEY (`member_no`)
    REFERENCES `member_tbl`(`member_no`)
    ON DELETE CASCADE,

    CONSTRAINT `fk_board_place`
    FOREIGN KEY (`place_no`)
    REFERENCES `board_place_tbl`(`place_no`)
    ON DELETE CASCADE
);

CREATE TABLE `board_like_tbl`
(
    `member_no` BIGINT NOT NULL,
    `board_no`  BIGINT NOT NULL,

    PRIMARY KEY (`member_no`, `board_no`),

    CONSTRAINT `fk_board_like_member`
    FOREIGN KEY (`member_no`)
    REFERENCES `member_tbl`(`member_no`)
    ON DELETE CASCADE,

    CONSTRAINT `fk_board_like_board`
    FOREIGN KEY (`board_no`)
    REFERENCES `board_tbl`(`board_no`)
    ON DELETE CASCADE
);

CREATE TABLE `board_comment_tbl`
(
    `board_comment_no` BIGINT NOT NULL AUTO_INCREMENT,
    `board_comment_content` VARCHAR(4000) NOT NULL,
    `board_comment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `member_no` BIGINT NOT NULL,
    `board_comment_status` TINYINT NOT NULL DEFAULT 1,
    `board_no` BIGINT NOT NULL,

    PRIMARY KEY (`board_comment_no`),

    CONSTRAINT `fk_comment_member`
    FOREIGN KEY (`member_no`)
    REFERENCES `member_tbl`(`member_no`)
    ON DELETE CASCADE,

    CONSTRAINT `fk_comment_board`
    FOREIGN KEY (`board_no`)
    REFERENCES `board_tbl`(`board_no`)
    ON DELETE CASCADE
);

CREATE TABLE `board_report_tbl`
(
    `board_report_no` BIGINT NOT NULL AUTO_INCREMENT,
    `member_no` BIGINT NOT NULL,
    `board_no` BIGINT NOT NULL,
    `report_reason` VARCHAR(100) NOT NULL,
    `report_status` TINYINT NOT NULL DEFAULT 0,
    `detail` TEXT NULL,
    `report_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`board_report_no`),

    CONSTRAINT `fk_report_member`
    FOREIGN KEY (`member_no`)
    REFERENCES `member_tbl`(`member_no`)
    ON DELETE CASCADE,

    CONSTRAINT `fk_report_board`
    FOREIGN KEY (`board_no`)
    REFERENCES `board_tbl`(`board_no`)
    ON DELETE CASCADE
);

CREATE TABLE `board_comment_report_tbl`
(
    `comment_report_no` BIGINT NOT NULL AUTO_INCREMENT,
    `member_no` BIGINT NOT NULL,
    `board_comment_no` BIGINT NOT NULL,
    `report_reason` VARCHAR(100) NOT NULL,
    `report_status` TINYINT NOT NULL DEFAULT 0,
    `detail` TEXT NULL,
    `report_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`comment_report_no`),

    CONSTRAINT `fk_comment_report_member`
    FOREIGN KEY (`member_no`)
    REFERENCES `member_tbl`(`member_no`)
    ON DELETE CASCADE,

    CONSTRAINT `fk_comment_report_comment`
    FOREIGN KEY (`board_comment_no`)
    REFERENCES `board_comment_tbl`(`board_comment_no`)
    ON DELETE CASCADE
);

CREATE TABLE `tag_tbl` (
    `tag_no` INT PRIMARY KEY AUTO_INCREMENT,
    `tag_name` VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE `menu_tbl` (
    `menu_no` BIGINT NOT NULL AUTO_INCREMENT,
    `rest_no` BIGINT NOT NULL,
    `menu_name` VARCHAR(1000) NOT NULL,
    `menu_price` INT NOT NULL,
    `menu_img` VARCHAR(3000) NOT NULL,

    PRIMARY KEY (`menu_no`),

    CONSTRAINT `fk_menu_restaurant`
        FOREIGN KEY (`rest_no`)
        REFERENCES `restaurant_tbl` (`rest_no`)
        ON DELETE CASCADE
);

CREATE TABLE `travel_plan_tbl` (
    `tplan_no` BIGINT NOT NULL AUTO_INCREMENT,
    `member_no` BIGINT NOT NULL,
    `tplan_title` VARCHAR(230) NOT NULL,
    `tplan_desc` VARCHAR(1000) NULL,
    `tplan_region` VARCHAR(100) NULL,
    `tplan_days` INT NOT NULL DEFAULT 1,
    `tplan_status` TINYINT NOT NULL DEFAULT 1,
    `tplan_total_price` INT NOT NULL DEFAULT 0,
    `tplan_view` INT NOT NULL DEFAULT 0,
    `tplan_like` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`tplan_no`),

    CONSTRAINT `fk_travel_plan_member`
        FOREIGN KEY (`member_no`)
        REFERENCES `member_tbl` (`member_no`)
        ON DELETE CASCADE
);

CREATE TABLE `plan_tag_tbl` (
    `tplan_no` BIGINT NOT NULL,
    `tag_no` INT NOT NULL,

    PRIMARY KEY (`tplan_no`, `tag_no`),

    CONSTRAINT `fk_plan_tag_plan`
        FOREIGN KEY (`tplan_no`)
        REFERENCES `travel_plan_tbl` (`tplan_no`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_plan_tag_tag`
        FOREIGN KEY (`tag_no`)
        REFERENCES `tag_tbl` (`tag_no`)
        ON DELETE CASCADE
);

CREATE TABLE `travel_schedule_tbl` (
    `tsche_no` BIGINT NOT NULL AUTO_INCREMENT,
    `tplan_no` BIGINT NOT NULL,
    `tsche_day_no` INT NOT NULL,
    `tsche_order_no` INT NOT NULL,
    `rest_no` BIGINT NOT NULL,

    PRIMARY KEY (`tsche_no`),

    CONSTRAINT `fk_schedule_plan`
        FOREIGN KEY (`tplan_no`)
        REFERENCES `travel_plan_tbl` (`tplan_no`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_schedule_restaurant`
        FOREIGN KEY (`rest_no`)
        REFERENCES `restaurant_tbl` (`rest_no`)
        ON DELETE CASCADE
);

CREATE TABLE `recommend_menu_tbl` (
    `tsche_no` BIGINT NOT NULL,
    `menu_no` BIGINT NOT NULL,

    PRIMARY KEY (`tsche_no`, `menu_no`),

    CONSTRAINT `fk_recommend_menu_schedule`
        FOREIGN KEY (`tsche_no`)
        REFERENCES `travel_schedule_tbl` (`tsche_no`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_recommend_menu_menu`
        FOREIGN KEY (`menu_no`)
        REFERENCES `menu_tbl` (`menu_no`)
        ON DELETE CASCADE
);

CREATE TABLE `travel_route_tbl` (
    `troute_no` BIGINT NOT NULL AUTO_INCREMENT,
    `from_tsche_no` BIGINT NOT NULL,
    `to_tsche_no` BIGINT NOT NULL,
    `transit_type` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`troute_no`),

    CONSTRAINT `fk_route_from`
        FOREIGN KEY (`from_tsche_no`)
        REFERENCES `travel_schedule_tbl` (`tsche_no`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_route_to`
        FOREIGN KEY (`to_tsche_no`)
        REFERENCES `travel_schedule_tbl` (`tsche_no`)
        ON DELETE CASCADE,

    CONSTRAINT `chk_transit_type`
        CHECK (`transit_type` IN ('WALK', 'PUB', 'CAR'))
);

CREATE TABLE `favorite_plan_tbl` (
    `member_no` BIGINT NOT NULL,
    `tplan_no` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`member_no`, `tplan_no`),

    CONSTRAINT `fk_favorite_member`
        FOREIGN KEY (`member_no`)
        REFERENCES `member_tbl` (`member_no`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_favorite_plan`
        FOREIGN KEY (`tplan_no`)
        REFERENCES `travel_plan_tbl` (`tplan_no`)
        ON DELETE CASCADE
);
INSERT INTO restaurant_tbl 
(member_id, rest_name, rest_addr, lat, lng, category, phone, hours, rating_sum, review_total_count, local_review_count, rest_content, ai_review, rest_status, rest_thumb, created_at)
VALUES
('test01', '가고파 숯불구이', '서울 마포구 와우산로 10', 37.5512, 126.9245, '고기구이', '02-123-4561', '12:00 - 23:00', 45, 10, 8, '육즙 가득한 삼겹살이 일품인 곳입니다.', '가성비가 좋고 고기 질이 훌륭하다는 평이 많습니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '낙원 타코타운', '경기 수원시 팔달구 신풍로 20', 37.2845, 127.0123, '아시안/멕시칸', '031-234-5672', '11:30 - 22:00', 18, 4, 2, '감성 넘치는 인테리어와 푸짐한 파히타 맛집.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '도란도란 한정식', '인천 남동구 인하로 30', 37.4432, 126.7011, '한식', '032-345-6783', '11:00 - 21:00', 23, 5, 5, '상견례 장소로 추천하는 정갈한 한정식집.', '부모님 모시고 가기 좋은 깔끔한 한정식 전문점입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '라라 파스타클럽', '서울 강남구 강남대로 40', 37.4979, 127.0276, '양식', '02-456-7894', '11:00 - 21:30', 0, 0, 0, '생면으로 만들어 식감이 살아있는 파스타 전문점.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '명가 안동국시', '경북 안동시 퇴계로 50', 36.5682, 128.7294, '면요리', '054-567-8901', '10:00 - 20:00', 68, 15, 14, '깊고 진한 사골 육수의 안동국시 전문점.', '로컬 주민들이 인정하는 깊은 국물 맛집입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '백년 삼계탕', '부산 해운대구 구남로 60', 35.1594, 129.1612, '백숙/삼계탕', '051-678-9012', '09:00 - 21:00', 38, 9, 4, '진한 한방 약재로 끓여낸 보양식 삼계탕.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '소담한 베이커리', '대구 중구 달구벌대로 70', 35.8655, 128.5932, '카페/베이커리', '053-789-0123', '08:00 - 22:00', 25, 5, 3, '당일 생산, 당일 판매 원칙의 유기농 빵집.', '소금빵과 크루아상이 특히 맛있는 감성 카페.', 'NORMAL', 'test1.png', NOW()),
('test01', '우마이 스시야', '서울 종로구 대학로 80', 37.5822, 127.0018, '일식', '02-890-1234', '11:30 - 22:00', 85, 20, 10, '숙성 사시미와 신선한 초밥을 맛볼 수 있는 곳.', '네타가 두툼하고 밥 양이 적당해 만족도가 높습니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '진미 짜장천국', '인천 중구 차이나타운로 90', 37.4761, 126.6214, '중식', '032-901-2345', '10:30 - 20:30', 42, 11, 6, '옛날 방식 그대로 볶아낸 수제 간짜장.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '청춘포차 낭만포차', '전남 여수시 돌산읍 100', 34.7312, 127.7511, '포장마차/술집', '061-111-2222', '18:00 - 02:00', 12, 3, 1, '돌산대교 야경을 보며 즐기는 해물삼합.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '카페 크림하우스', '강원 강릉시 창해로 110', 37.7915, 128.9145, '카페/베이커리', '033-222-3333', '09:00 - 23:00', 50, 10, 5, '오션뷰가 환상적인 크림라떼 맛집.', '바다 뷰가 멋지고 시그니처 음료가 독특합니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '타이 가든', '서울 용산구 이태원로 120', 37.5345, 126.9942, '아시안/멕시칸', '02-333-4444', '11:30 - 22:00', 22, 5, 2, '태국 현지 셰프가 요리하는 똠얌꿍 맛집.', '현지의 맛을 그대로 재현한 똠얌꿍과 팟타이.', 'NORMAL', 'test1.png', NOW()),
('test01', '파이어 수제버거', '부산 수영구 광안해변로 130', 35.1532, 129.1182, '패스트푸드', '051-444-5555', '11:00 - 24:00', 0, 0, 0, '참숯 향 가득한 패티가 들어간 미국식 버거.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '한라 국수공방', '제주 서귀포시 중문관광로 140', 33.2484, 126.4123, '면요리', '064-555-6666', '08:00 - 16:00', 92, 21, 18, '제주산 흑돼지로 우려낸 진한 고기국수.', '고기 고명이 푸짐하고 잡내가 전혀 나지 않습니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '경성 돈까스', '서울 서대문구 신촌로 150', 37.5562, 126.9365, '일식', '02-666-7777', '11:00 - 20:30', 21, 5, 2, '겉바속촉의 정석, 경양식 돈까스 맛집.', '튀김옷이 바삭하고 소스가 중독성 있습니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '동해 바다 양포수산', '경북 포항시 북구 해안로 160', 36.0521, 129.3784, '해산물', '054-777-8888', '10:00 - 22:00', 40, 10, 9, '산지 직송 참가자미 물회 전문점.', '자연산 회가 정말 신선하고 매운탕이 시원합니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '불타는 닭갈비', '강원 춘천시 금강로 170', 37.8812, 127.7291, '고기구이', '033-888-9999', '11:00 - 23:00', 15, 4, 3, '철판에 볶아먹는 매콤한 춘천 정통 닭갈비.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '성수 족발제왕', '서울 성동구 아차산로 180', 37.5445, 127.0562, '고기구이', '02-999-0000', '16:00 - 24:00', 65, 15, 8, '야들야들하고 부드러운 한방 왕족발.', '콜라겐 가득한 껍질 부분이 쫄깃하고 맛있습니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '중화요리 만리장성', '대전 중구 중앙로 190', 36.3284, 127.4251, '중식', '042-123-0000', '11:00 - 21:00', 23, 5, 4, '불맛 제대로 살린 짬뽕과 탕수육 세트 맛집.', '짬뽕 국물이 얼큰해서 해장으로 최고입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '효자 오리주물럭', '전북 전주시 완산구 홍산로 200', 35.8152, 127.1042, '고기구이', '063-234-0000', '11:30 - 22:00', 8, 2, 2, '매콤달콤한 양념의 오리 주물럭과 볶음밥.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '가야 밀면전문점', '부산진구 가야대로 210', 35.1554, 129.0234, '면요리', '051-891-1235', '10:30 - 20:30', 44, 10, 9, '시원하고 살얼음 동동 띄워진 육수가 끝내주는 밀면집.', '여름철에 무조건 방문해야 하는 부산 로컬 밀면 맛집입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '남도 바지락칼국수', '광주 북구 면앙로 220', 35.1742, 126.9125, '면요리', '062-522-3456', '11:00 - 21:00', 16, 4, 3, '바지락이 산더미처럼 쌓여 나오는 시원한 국물 요리.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '동성로 매운갈비찜', '대구 중구 동성로 230', 35.8711, 128.6014, '고기구이', '053-421-5678', '11:30 - 22:00', 65, 15, 12, '마늘 향 가득하고 화끈하게 매운 양념 갈비찜.', '스트레스 풀리는 화끈한 매운맛과 볶음밥의 조화가 훌륭합니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '루프탑 라운지 바', '서울 용산구 회나무로 240', 37.5395, 126.9884, '포장마차/술집', '02-792-7890', '17:00 - 02:00', 0, 0, 0, '남산타워 뷰를 감상하며 칵테일을 즐길 수 있는 곳.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '목포 낙지마당', '전남 목포시 영산로 250', 34.8123, 126.3941, '해산물', '061-274-9012', '10:00 - 22:00', 22, 5, 5, '쓰러진 소도 일으킨다는 신선한 갯벌 낙지 요리.', '연포탕 국물이 깊고 낙지가 아주 야들야들합니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '보문뜰 떡갈비', '경북 경주시 보문로 260', 35.8432, 129.2564, '한식', '054-775-0123', '11:00 - 21:30', 88, 20, 11, '정갈한 밑반찬과 달콤 짭조름한 수제 떡갈비 정식.', '남녀노소 호불호 없이 즐길 수 있는 깔끔한 정식 구성입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '새벽집 육회비빔밥', '서울 강남구 도산대로 270', 37.5241, 127.0423, '한식', '02-546-5789', '00:00 - 24:00', 43, 10, 6, '신선한 당일 도축 한우만을 사용하는 비빔밥 전문점.', '고기가 신선하고 같이 나오는 선지해장국이 일품입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '아우내 장터순대', '충남 천안시 동남구 아우내순대길 280', 36.8041, 127.3245, '한식', '041-564-1122', '08:00 - 20:00', 11, 3, 3, '병천 순대거리의 원조, 속이 꽉 찬 순대국밥.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '자갈치 꼼장어구이', '부산 중구 자갈치해안로 290', 35.0965, 129.0312, '해산물', '051-245-3344', '12:00 - 02:00', 21, 5, 2, '연탄불에 구워 불향이 가득 배어있는 양념 꼼장어.', '자갈치 시장 특유의 감성과 쫄깃한 식감이 살아있습니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '초당 두부마을집', '강원 강릉시 초당순두부길 300', 37.7901, 128.9112, '한식', '033-652-5566', '07:00 - 16:00', 95, 22, 19, '국산 콩과 동해 바닷물로 만든 고소한 순두부.', '자극적이지 않고 몽글몽글하며 담백한 맛이 최고입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '쿠마 로멘 전문점', '경기 성남시 분당구 정자일로 310', 37.3654, 127.1084, '일식', '031-714-7788', '11:30 - 21:30', 0, 0, 0, '진하게 우려낸 돈코츠 라멘과 차슈 덮밥 맛집.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '태양초 닭발', '인천 부평구 시장로 320', 37.4921, 126.7245, '포장마차/술집', '032-505-9988', '17:00 - 03:00', 17, 4, 3, '스트레스 풀리는 매콤함, 직화 구이 뼈없는 닭발.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '평양 면옥', '서울 중구 장충단로 330', 37.5612, 127.0045, '면요리', '02-2267-7788', '11:00 - 21:30', 66, 15, 10, '은은한 육향과 메밀 향이 매력적인 슴슴한 평양냉면.', '평냉 마니아들이 꼽는 메밀 면발의 식감이 아주 훌륭한 곳.', 'NORMAL', 'test1.png', NOW()),
('test01', '해운대 암소갈비', '부산 해운대구 중동2로 340', 35.1632, 129.1654, '고기구이', '051-746-0033', '11:30 - 22:00', 115, 25, 15, '부드러운 소갈비와 시그니처 감자 사리가 별미인 곳.', '가격대는 높지만 고기가 입에서 녹고 감자사리는 필수입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '광장시장 순희네', '서울 종로구 창경궁로 350', 37.5701, 127.0012, '한식', '02-2268-3344', '09:00 - 21:00', 42, 10, 5, '맷돌로 직접 갈아 만든 바삭한 녹두빈대떡.', '시장의 활기찬 분위기와 겉바속촉 빈대떡의 정석입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '나주 노안집', '전남 나주시 금성관길 360', 35.0315, 126.7184, '한식', '061-333-2233', '07:00 - 20:00', 24, 5, 5, '맑은 국물과 푸짐한 머릿고기가 들어간 곰탕.', '전통 방식으로 토렴하여 국물이 맑고 깊은 맛을 냅니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '대포항 튀김골목', '강원 속초시 대포항희망길 370', 38.1741, 128.6084, '해산물', '033-633-1122', '10:00 - 22:00', 8, 2, 2, '갓 튀겨내어 바삭함이 살아있는 왕새우 튀김.', NULL, 'NORMAL', 'test1.png', NOW()),
('test01', '무등산 보리밥', '광주 동구 지호로 380', 35.1512, 126.9456, '한식', '062-222-7788', '11:30 - 21:00', 21, 5, 4, '각종 산나물을 아낌없이 넣고 비벼 먹는 보리밥.', '시골 할머니 손맛이 느껴지는 푸짐한 쌈밥과 나물 반찬.', 'NORMAL', 'test1.png', NOW()),
('test01', '신당동 마복림', '서울 중구 다산로 390', 37.5584, 127.0154, '패스트푸드', '02-2232-8989', '09:00 - 23:00', 62, 15, 8, '고추장과 춘장을 황금 비율로 섞은 원조 즉석떡볶이.', '오랜 역사를 자랑하는 추억의 즉석 떡볶이 맛집입니다.', 'NORMAL', 'test1.png', NOW()),
('test01', '화개장터 은어회', '경남 하동군 화개면 400', 35.1952, 127.6214, '해산물', '055-883-9900', '09:00 - 21:00', 13, 3, 2, '섬진강 맑은 물에서 자란 신선하고 향긋한 은어 요리.', NULL, 'NORMAL', 'test1.png', NOW());

INSERT INTO tag_tbl (tag_name) VALUES
('감성'),
('분위기좋은'),
('조용한'),
('힙한'),
('뷰맛집'),
('사진맛집'),
('연인과'),
('가족과'),
('친구와'),
('혼밥'),
('단체모임'),
('가성비'),
('푸짐한'),
('디저트맛집'),
('커피맛집'),
('숨은맛집'),
('현지인추천'),
('데이트'),
('드라이브'),
('먹방코스');

INSERT INTO menu_tbl (REST_NO, MENU_NAME, MENU_PRICE, MENU_IMG) VALUES
(1,'숯불 삼겹살',15000,'menu1_1.png'),
(1,'목살',16000,'menu1_2.png'),
(1,'된장찌개',7000,'menu1_3.png'),
(2,'파히타',28000,'menu2_1.png'),
(2,'소고기 타코',12000,'menu2_2.png'),
(2,'나초',9000,'menu2_3.png'),
(3,'한정식 정식',22000,'menu3_1.png'),
(3,'보리굴비 정식',28000,'menu3_2.png'),
(3,'떡갈비 정식',19000,'menu3_3.png'),
(4,'트러플 크림 파스타',18000,'menu4_1.png'),
(4,'봉골레 파스타',17000,'menu4_2.png'),
(4,'스테이크',32000,'menu4_3.png'),
(5,'안동국시',9000,'menu5_1.png'),
(5,'수육',18000,'menu5_2.png'),
(5,'만두',7000,'menu5_3.png'),
(6,'한방 삼계탕',17000,'menu6_1.png'),
(6,'전복 삼계탕',22000,'menu6_2.png'),
(6,'닭죽',8000,'menu6_3.png'),
(7,'소금빵',3500,'menu7_1.png'),
(7,'크루아상',4000,'menu7_2.png'),
(7,'아메리카노',4500,'menu7_3.png'),
(8,'모둠 초밥',25000,'menu8_1.png'),
(8,'연어 초밥',18000,'menu8_2.png'),
(8,'사시미',35000,'menu8_3.png'),
(9,'간짜장',8000,'menu9_1.png'),
(9,'짬뽕',10000,'menu9_2.png'),
(9,'탕수육',22000,'menu9_3.png'),
(10,'해물삼합',35000,'menu10_1.png'),
(10,'해물라면',8000,'menu10_2.png'),
(10,'소주',5000,'menu10_3.png'),
(11,'크림라떼',6500,'menu11_1.png'),
(11,'딸기케이크',7500,'menu11_2.png'),
(11,'아메리카노',5000,'menu11_3.png'),
(12,'똠얌꿍',17000,'menu12_1.png'),
(12,'팟타이',14000,'menu12_2.png'),
(12,'카오팟',13000,'menu12_3.png'),
(13,'시그니처 버거',12000,'menu13_1.png'),
(13,'치즈버거',11000,'menu13_2.png'),
(13,'감자튀김',5000,'menu13_3.png'),
(14,'고기국수',10000,'menu14_1.png'),
(14,'비빔국수',9000,'menu14_2.png'),
(14,'돔베고기',18000,'menu14_3.png'),
(15,'경양식 돈까스',11000,'menu15_1.png'),
(15,'치즈 돈까스',13000,'menu15_2.png'),
(15,'우동',8000,'menu15_3.png'),
(16,'참가자미 물회',18000,'menu16_1.png'),
(16,'모둠회',45000,'menu16_2.png'),
(16,'매운탕',12000,'menu16_3.png'),
(17,'춘천 닭갈비',14000,'menu17_1.png'),
(17,'볶음밥',3000,'menu17_2.png'),
(17,'막국수',8000,'menu17_3.png'),
(18,'왕족발',35000,'menu18_1.png'),
(18,'쟁반국수',12000,'menu18_2.png'),
(18,'주먹밥',5000,'menu18_3.png'),
(19,'짬뽕',10000,'menu19_1.png'),
(19,'짜장면',8000,'menu19_2.png'),
(19,'탕수육',22000,'menu19_3.png'),
(20,'오리주물럭',18000,'menu20_1.png'),
(20,'볶음밥',3000,'menu20_2.png'),
(20,'오리탕',12000,'menu20_3.png'),
(21,'물밀면',9000,'menu21_1.png'),
(21,'비빔밀면',9500,'menu21_2.png'),
(21,'만두',7000,'menu21_3.png'),
(22,'바지락칼국수',9000,'menu22_1.png'),
(22,'해물파전',15000,'menu22_2.png'),
(22,'수제비',9000,'menu22_3.png'),
(23,'매운갈비찜',32000,'menu23_1.png'),
(23,'계란찜',5000,'menu23_2.png'),
(23,'볶음밥',3000,'menu23_3.png'),
(24,'시그니처 칵테일',15000,'menu24_1.png'),
(24,'하이볼',9000,'menu24_2.png'),
(24,'치즈플래터',18000,'menu24_3.png'),
(25,'연포탕',35000,'menu25_1.png'),
(25,'낙지볶음',18000,'menu25_2.png'),
(25,'산낙지',25000,'menu25_3.png'),
(26,'떡갈비 정식',18000,'menu26_1.png'),
(26,'불고기 정식',17000,'menu26_2.png'),
(26,'냉면',9000,'menu26_3.png'),
(27,'육회비빔밥',14000,'menu27_1.png'),
(27,'육회',28000,'menu27_2.png'),
(27,'선지해장국',10000,'menu27_3.png'),
(28,'순대국밥',10000,'menu28_1.png'),
(28,'모둠순대',15000,'menu28_2.png'),
(28,'술국',12000,'menu28_3.png'),
(29,'양념 꼼장어',22000,'menu29_1.png'),
(29,'소금구이 꼼장어',22000,'menu29_2.png'),
(29,'해물라면',8000,'menu29_3.png'),
(30,'초당순두부',12000,'menu30_1.png'),
(30,'두부전골',18000,'menu30_2.png'),
(30,'두부김치',15000,'menu30_3.png'),
(31,'돈코츠 라멘',11000,'menu31_1.png'),
(31,'차슈덮밥',9000,'menu31_2.png'),
(31,'교자',6000,'menu31_3.png'),
(32,'직화 닭발',17000,'menu32_1.png'),
(32,'주먹밥',5000,'menu32_2.png'),
(32,'계란찜',5000,'menu32_3.png'),
(33,'평양냉면',15000,'menu33_1.png'),
(33,'수육',28000,'menu33_2.png'),
(33,'만두',9000,'menu33_3.png'),
(34,'생갈비',48000,'menu34_1.png'),
(34,'양념갈비',45000,'menu34_2.png'),
(34,'감자사리',5000,'menu34_3.png'),
(35,'녹두빈대떡',8000,'menu35_1.png'),
(35,'육회',20000,'menu35_2.png'),
(35,'막걸리',5000,'menu35_3.png'),
(36,'나주곰탕',11000,'menu36_1.png'),
(36,'수육',25000,'menu36_2.png'),
(36,'곰탕 특',14000,'menu36_3.png'),
(37,'왕새우튀김',15000,'menu37_1.png'),
(37,'오징어튀김',10000,'menu37_2.png'),
(37,'모둠튀김',18000,'menu37_3.png'),
(38,'산채보리밥',12000,'menu38_1.png'),
(38,'청국장',9000,'menu38_2.png'),
(38,'도토리묵',8000,'menu38_3.png'),
(39,'즉석떡볶이',7000,'menu39_1.png'),
(39,'라면사리',2000,'menu39_2.png'),
(39,'튀김모둠',6000,'menu39_3.png'),
(40,'은어회',25000,'menu40_1.png'),
(40,'은어튀김',18000,'menu40_2.png'),
(40,'매운탕',12000,'menu40_3.png');

INSERT INTO rest_like_tbl (member_id, rest_no) VALUES
('test01', 5),
('test01', 12),
('test01', 19),
('test01', 26),
('test01', 31),
('test01', 34),
('test01', 40);

UPDATE RESTAURANT_TBL 
SET rest_thumb = 'basic.jpeg';

UPDATE MENU_TBL 
SET MENU_IMG = 'basic.jpeg';

INSERT INTO restaurant_tbl (member_id, rest_name, rest_addr, lat, lng, category, phone, hours, rating_sum, review_total_count, local_review_count, rest_content, ai_review, rest_status, rest_thumb, created_at) VALUES
('qqqq1111', '강남 소고기마당', '서울 강남구 강남대로 123', 37.4979, 127.0276, '한식', '02-1234-5001', '11:00~22:00', 23, 5, 3, '강남 한복판에서 즐기는 프리미엄 한우 전문점입니다.', '고급스러운 분위기의 한우 전문 맛집', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest1.jpg', '2024-10-01 10:00:00'),
('qqqq1111', '성수 브런치카페', '서울 성동구 성수이로 45', 37.5443, 127.0557, '카페', '02-1234-5002', '09:00~21:00', 19, 4, 2, '성수동 감성 가득한 브런치 카페입니다.', '트렌디한 성수동 카페', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest2.jpg', '2024-10-05 11:00:00'),
('qqqq1111', '홍대 마라탕', '서울 마포구 홍익로 78', 37.5572, 126.9236, '중식', '02-1234-5003', '11:00~23:00', 17, 4, 1, '홍대에서 가장 핫한 마라탕 전문점입니다.', '매콤하고 얼큰한 마라탕 맛집', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest3.jpg', '2024-10-08 12:00:00'),
('qqqq1111', '잠실 초밥천국', '서울 송파구 올림픽로 101', 37.5133, 127.1000, '일식', '02-1234-5004', '12:00~22:00', 20, 4, 2, '잠실에서 즐기는 정통 일식 초밥 전문점입니다.', '신선한 재료로 만든 초밥 맛집', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest4.jpg', '2024-10-10 13:00:00'),
('qqqq1111', '종로 삼겹살집', '서울 종로구 종로 55', 37.5720, 126.9794, '한식', '02-1234-5005', '17:00~24:00', 18, 4, 3, '종로 한가운데 위치한 연탄불 삼겹살 맛집입니다.', '전통 연탄불 삼겹살의 진수', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest5.jpg', '2024-10-12 14:00:00'),
('wwww2222', '을지로 곱창골목', '서울 중구 을지로 88', 37.5659, 126.9876, '한식', '02-1234-5006', '17:00~02:00', 22, 5, 4, '을지로 유명 곱창골목의 원조 맛집입니다.', '을지로 핫플레이스 곱창 전문점', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest6.jpg', '2024-10-14 10:00:00'),
('wwww2222', '건대 치킨맥주', '서울 광진구 능동로 122', 37.5403, 127.0698, '한식', '02-1234-5007', '16:00~02:00', 16, 4, 2, '건대 앞 인기 치맥 전문점입니다.', '건대에서 가장 유명한 치킨 맛집', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest7.jpg', '2024-10-16 11:00:00'),
('wwww2222', '신촌 파스타집', '서울 서대문구 신촌로 66', 37.5596, 126.9368, '양식', '02-1234-5008', '11:30~22:00', 21, 5, 3, '신촌에서 즐기는 정통 이탈리안 파스타 맛집입니다.', '홈메이드 생면 파스타 전문점', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest8.jpg', '2024-10-18 12:00:00'),
('wwww2222', '여의도 해산물뷔페', '서울 영등포구 여의대로 30', 37.5219, 126.9244, '해산물', '02-1234-5009', '11:00~21:30', 24, 5, 3, '여의도 한강변에 위치한 신선한 해산물 뷔페입니다.', '한강 뷰와 함께하는 해산물 뷔페', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest9.jpg', '2024-10-20 13:00:00'),
('wwww2222', '이태원 멕시칸', '서울 용산구 이태원로 200', 37.5346, 126.9946, '양식', '02-1234-5010', '12:00~23:00', 15, 4, 1, '이태원에서 즐기는 정통 멕시칸 요리 전문점입니다.', '다양한 외국 음식을 즐길 수 있는 이태원 맛집', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest10.jpg', '2024-10-22 14:00:00'),
('eeee3333', '망원 떡볶이명가', '서울 마포구 망원로 33', 37.5557, 126.9099, '분식', '02-1234-5011', '10:00~21:00', 18, 4, 3, '망원동 골목에서 30년 전통의 떡볶이 맛집입니다.', '할머니의 손맛이 느껴지는 전통 분식집', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest11.jpg', '2024-10-24 10:00:00'),
('eeee3333', '노량진 회센터', '서울 동작구 노량진로 77', 37.5133, 126.9427, '해산물', '02-1234-5012', '09:00~23:00', 23, 5, 4, '노량진 수산시장 근처 최고의 회 전문점입니다.', '신선한 활어회 전문점', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest12.jpg', '2024-10-26 11:00:00'),
('eeee3333', '강남 라멘바', '서울 강남구 테헤란로 44', 37.5008, 127.0362, '일식', '02-1234-5013', '11:00~22:00', 20, 5, 2, '강남에서 즐기는 정통 일본식 라멘 전문점입니다.', '진한 돈코츠 육수의 라멘 맛집', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest13.jpg', '2024-10-28 12:00:00'),
('eeee3333', '성수 스테이크하우스', '서울 성동구 서울숲2길 32', 37.5449, 127.0456, '양식', '02-1234-5014', '12:00~22:00', 25, 5, 3, '성수동 서울숲 인근 프리미엄 스테이크 레스토랑입니다.', '셰프의 특제 소스로 완성한 스테이크', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest14.jpg', '2024-10-30 13:00:00'),
('eeee3333', '홍대 중국집', '서울 마포구 와우산로 55', 37.5540, 126.9221, '중식', '02-1234-5015', '11:00~22:00', 16, 4, 2, '홍대 인근 정통 중화요리 전문점입니다.', '전통 중화요리의 진수를 맛볼 수 있는 곳', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest15.jpg', '2024-11-01 14:00:00'),
('rrrr4444', '잠실 한정식', '서울 송파구 잠실로 99', 37.5111, 127.0985, '한식', '02-1234-5016', '11:30~21:00', 22, 5, 4, '잠실에서 즐기는 전통 한정식 코스 요리입니다.', '정갈한 한정식 코스 전문점', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest16.jpg', '2024-11-03 10:00:00'),
('rrrr4444', '이태원 버거집', '서울 용산구 이태원로1길 11', 37.5352, 126.9924, '양식', '02-1234-5017', '11:00~23:00', 17, 4, 1, '이태원에서 즐기는 수제버거 전문점입니다.', '수제 패티로 만든 정통 수제버거', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest17.jpg', '2024-11-05 11:00:00'),
('rrrr4444', '종로 냉면집', '서울 종로구 창경궁로 22', 37.5781, 126.9987, '한식', '02-1234-5018', '11:00~21:00', 20, 5, 4, '종로 오래된 골목의 전통 평양냉면 전문점입니다.', '70년 전통의 평양냉면 노포', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest18.jpg', '2024-11-07 12:00:00'),
('rrrr4444', '건대 순대국밥', '서울 광진구 자양로 88', 37.5391, 127.0712, '한식', '02-1234-5019', '07:00~22:00', 19, 5, 3, '건대 인근 24시간 순대국밥 전문점입니다.', '진한 국물의 순대국밥 맛집', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest19.jpg', '2024-11-09 13:00:00'),
('rrrr4444', '신촌 해물탕', '서울 서대문구 연세로 77', 37.5567, 126.9378, '해산물', '02-1234-5020', '12:00~23:00', 21, 5, 3, '신촌 연세대 앞 인기 해물탕 전문점입니다.', '푸짐한 해물이 가득한 해물탕', 'NORMAL', 'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/rest/rest20.jpg', '2024-11-11 14:00:00');

-- menu_tbl (맛집당 4개, 총 80개)
INSERT INTO menu_tbl (REST_NO, MENU_NAME, MENU_PRICE, MENU_IMG) VALUES
(1,'한우 등심 1인분',35000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m1_1.jpg'),
(1,'한우 갈비 1인분',38000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m1_2.jpg'),
(1,'냉면',12000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m1_3.jpg'),
(1,'된장찌개',8000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m1_4.jpg'),
(2,'아보카도 토스트',14000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m2_1.jpg'),
(2,'아메리카노',5500,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m2_2.jpg'),
(2,'크로플',8000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m2_3.jpg'),
(2,'에그베네딕트',16000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m2_4.jpg'),
(3,'마라탕 소',18000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m3_1.jpg'),
(3,'마라탕 대',28000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m3_2.jpg'),
(3,'마라샹궈',25000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m3_3.jpg'),
(3,'탕수육',20000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m3_4.jpg'),
(4,'초밥 10피스',18000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m4_1.jpg'),
(4,'연어초밥 세트',22000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m4_2.jpg'),
(4,'참치 대뱃살 초밥',28000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m4_3.jpg'),
(4,'우동',12000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m4_4.jpg'),
(5,'삼겹살 1인분',14000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m5_1.jpg'),
(5,'목살 1인분',13000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m5_2.jpg'),
(5,'볶음밥',4000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m5_3.jpg'),
(5,'된장찌개',3000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m5_4.jpg'),
(6,'곱창 1인분',17000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m6_1.jpg'),
(6,'대창 1인분',19000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m6_2.jpg'),
(6,'모둠구이 2인분',38000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m6_3.jpg'),
(6,'볶음밥',4000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m6_4.jpg'),
(7,'후라이드 치킨',18000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m7_1.jpg'),
(7,'양념 치킨',19000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m7_2.jpg'),
(7,'생맥주 500cc',4500,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m7_3.jpg'),
(7,'감자튀김',6000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m7_4.jpg'),
(8,'까르보나라',16000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m8_1.jpg'),
(8,'알리오올리오',14000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m8_2.jpg'),
(8,'토마토 파스타',15000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m8_3.jpg'),
(8,'마르게리타 피자',18000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m8_4.jpg'),
(9,'랍스터 세트',65000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m9_1.jpg'),
(9,'킹크랩 1kg',80000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m9_2.jpg'),
(9,'성게알 덮밥',22000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m9_3.jpg'),
(9,'조개찜',28000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m9_4.jpg'),
(10,'타코 3개',14000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m10_1.jpg'),
(10,'부리토',13000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m10_2.jpg'),
(10,'나초',9000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m10_3.jpg'),
(10,'콜라',3000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m10_4.jpg'),
(11,'떡볶이',5000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m11_1.jpg'),
(11,'순대',5000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m11_2.jpg'),
(11,'튀김 5개',3000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m11_3.jpg'),
(11,'어묵',3000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m11_4.jpg'),
(12,'광어 회 200g',35000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m12_1.jpg'),
(12,'연어 회 200g',38000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m12_2.jpg'),
(12,'모둠 회',55000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m12_3.jpg'),
(12,'매운탕',15000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m12_4.jpg'),
(13,'돈코츠 라멘',13000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m13_1.jpg'),
(13,'쇼유 라멘',12000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m13_2.jpg'),
(13,'카라아게',10000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m13_3.jpg'),
(13,'교자 6개',8000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m13_4.jpg'),
(14,'채끝 스테이크',55000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m14_1.jpg'),
(14,'등심 스테이크',65000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m14_2.jpg'),
(14,'샐러드',12000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m14_3.jpg'),
(14,'리조또',18000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m14_4.jpg'),
(15,'짜장면',8000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m15_1.jpg'),
(15,'짬뽕',9000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m15_2.jpg'),
(15,'탕수육 소',18000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m15_3.jpg'),
(15,'볶음밥',9000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m15_4.jpg'),
(16,'한정식 코스 A',35000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m16_1.jpg'),
(16,'한정식 코스 B',45000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m16_2.jpg'),
(16,'불고기 정식',20000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m16_3.jpg'),
(16,'갈비찜 정식',25000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m16_4.jpg'),
(17,'클래식 버거',14000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m17_1.jpg'),
(17,'더블 패티 버거',18000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m17_2.jpg'),
(17,'어니언링',7000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m17_3.jpg'),
(17,'밀크셰이크',7000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m17_4.jpg'),
(18,'물냉면',12000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m18_1.jpg'),
(18,'비빔냉면',12000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m18_2.jpg'),
(18,'평양식 만두',10000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m18_3.jpg'),
(18,'제육볶음',13000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m18_4.jpg'),
(19,'순대국밥',9000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m19_1.jpg'),
(19,'섞어 순대국밥',10000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m19_2.jpg'),
(19,'순대 한접시',8000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m19_3.jpg'),
(19,'수육',22000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m19_4.jpg'),
(20,'해물탕 2인',35000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m20_1.jpg'),
(20,'해물탕 3인',48000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m20_2.jpg'),
(20,'낙지볶음',18000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m20_3.jpg'),
(20,'공기밥',1000,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/menu/m20_4.jpg');

-- review_tbl (50개)
INSERT INTO review_tbl (member_id, rest_no, review_content, rating, visit_date, is_local_review, review_status, created_at) VALUES
('qqqq1111',1,'고기 질이 정말 최상급이에요. 서비스도 친절하고 분위기도 좋아서 특별한 날에 딱이에요.',5,'2025-01-15',TRUE,0,'2025-01-16 10:00:00'),
('wwww2222',1,'한우 등심이 정말 부드러웠어요. 가격이 좀 있지만 그만큼 가치는 충분히 있습니다.',5,'2025-01-20',FALSE,0,'2025-01-21 11:00:00'),
('eeee3333',2,'성수동 감성이 물씬 풍기는 카페예요. 브런치 메뉴가 다양하고 맛도 훌륭했어요.',4,'2025-02-03',TRUE,0,'2025-02-04 09:00:00'),
('rrrr4444',2,'인테리어가 너무 예뻐서 사진 찍기 좋아요. 커피도 맛있고 에그베네딕트 강추합니다.',5,'2025-02-10',FALSE,0,'2025-02-11 10:00:00'),
('qqqq1111',3,'홍대 마라탕 중에서 제일 맛있어요. 웨이팅은 있었지만 충분히 기다릴 만한 가치가 있었습니다.',5,'2025-02-15',TRUE,0,'2025-02-16 12:00:00'),
('wwww2222',3,'매운맛 조절이 되어서 좋아요. 채소도 신선하고 양도 푸짐해서 만족스러웠어요.',4,'2025-02-18',FALSE,0,'2025-02-19 13:00:00'),
('eeee3333',4,'초밥이 정말 신선했어요. 연어초밥 세트 추천합니다. 재방문 의사 있습니다.',5,'2025-02-20',TRUE,0,'2025-02-21 11:00:00'),
('rrrr4444',4,'가성비 좋은 초밥집이에요. 점심 특선 메뉴가 따로 있으면 더 좋겠어요.',4,'2025-02-25',FALSE,0,'2025-02-26 12:00:00'),
('qqqq1111',5,'연탄불 삼겹살의 정석이에요. 종로 분위기와 잘 어울리는 노포 감성 맛집입니다.',5,'2025-03-02',TRUE,0,'2025-03-03 18:00:00'),
('wwww2222',5,'볶음밥이 진짜 맛있어요! 삼겹살 먹고 볶음밥으로 마무리하는 게 정석이죠.',4,'2025-03-05',FALSE,0,'2025-03-06 19:00:00'),
('eeee3333',6,'을지로 곱창의 성지예요. 대창이 특히 맛있고 현지인들이 많이 찾는 곳이에요.',5,'2025-03-08',TRUE,0,'2025-03-09 17:00:00'),
('rrrr4444',6,'웨이팅이 길지만 기다릴 만해요. 곱창 특유의 잡내 없이 깔끔하게 구워줘서 만족했어요.',5,'2025-03-10',FALSE,0,'2025-03-11 18:00:00'),
('qqqq1111',7,'치킨이 바삭바삭해요! 맥주랑 같이 먹으니 더 맛있었어요. 건대 근처 최고 치맥집이에요.',4,'2025-03-12',TRUE,0,'2025-03-13 17:00:00'),
('wwww2222',7,'양이 많고 가격이 합리적이에요. 친구들이랑 가기 좋은 곳입니다.',4,'2025-03-15',FALSE,0,'2025-03-16 18:00:00'),
('eeee3333',8,'생면 파스타가 진짜 맛있어요. 까르보나라 크리미함이 딱 제 스타일이에요.',5,'2025-03-18',TRUE,0,'2025-03-19 12:00:00'),
('rrrr4444',8,'데이트하기 딱 좋은 분위기예요. 파스타도 맛있고 직원분들이 친절해서 기분 좋게 먹었어요.',5,'2025-03-20',FALSE,0,'2025-03-21 13:00:00'),
('qqqq1111',9,'킹크랩이 정말 신선하고 맛있어요. 여의도 한강 뷰 보면서 먹으니 더 특별했어요.',5,'2025-03-22',FALSE,0,'2025-03-23 11:00:00'),
('wwww2222',9,'랍스터 세트 가격 대비 만족도 높아요. 해산물 종류도 다양해서 좋았습니다.',4,'2025-03-25',FALSE,0,'2025-03-26 12:00:00'),
('eeee3333',10,'이태원에서 이렇게 맛있는 멕시칸 음식을 먹을 수 있을 줄 몰랐어요. 타코 강추!',4,'2025-03-28',FALSE,0,'2025-03-29 13:00:00'),
('rrrr4444',10,'부리또가 엄청 든든해요. 분위기도 이국적이고 데이트 장소로도 좋을 것 같아요.',4,'2025-04-01',FALSE,0,'2025-04-02 12:00:00'),
('qqqq1111',11,'30년 전통 떡볶이 맛이에요. 국물이 진하고 달달해서 자꾸 생각나는 맛이에요.',5,'2025-04-03',TRUE,0,'2025-04-04 14:00:00'),
('wwww2222',11,'순대도 맛있고 튀김도 바삭해요. 가성비 최고입니다. 혼밥하기도 부담 없어요.',4,'2025-04-05',FALSE,0,'2025-04-06 13:00:00'),
('eeee3333',12,'노량진 회가 이렇게 싱싱한지 몰랐어요. 모둠회 시켰는데 종류도 다양하고 맛있었어요.',5,'2025-04-08',FALSE,0,'2025-04-09 11:00:00'),
('rrrr4444',12,'매운탕 국물이 진짜 시원해요. 회 먹고 매운탕으로 마무리하니 완벽한 식사였어요.',5,'2025-04-10',FALSE,0,'2025-04-11 12:00:00'),
('qqqq1111',13,'돈코츠 라멘 육수가 진하고 깊은 맛이에요. 면발도 적당히 쫄깃해서 완벽했어요.',5,'2025-04-12',TRUE,0,'2025-04-13 12:00:00'),
('wwww2222',13,'쇼유 라멘도 맛있어요. 교자랑 같이 시켰는데 잘 어울려요.',4,'2025-04-15',FALSE,0,'2025-04-16 13:00:00'),
('eeee3333',14,'스테이크가 정말 예술이에요. 채끝 스테이크 미디엄으로 먹었는데 육즙이 살아있어요.',5,'2025-04-18',TRUE,0,'2025-04-19 18:00:00'),
('rrrr4444',14,'서울숲 근처 스테이크집 중 최고예요. 분위기도 고급스럽고 재방문 의사 있습니다.',5,'2025-04-20',FALSE,0,'2025-04-21 19:00:00'),
('qqqq1111',15,'짬뽕이 불맛이 살아있어요. 직접 만든 면이라 더 맛있게 느껴졌어요.',4,'2025-04-22',FALSE,0,'2025-04-23 11:00:00'),
('wwww2222',15,'탕수육 소스가 새콤달콤해요. 짜장면이랑 짬뽕 둘 다 맛있어서 매번 고민돼요.',4,'2025-04-25',FALSE,0,'2025-04-26 12:00:00'),
('eeee3333',16,'한정식 코스 B 시켰는데 반찬이 20가지가 넘더라고요. 정성이 느껴지는 식사였어요.',5,'2025-04-28',TRUE,0,'2025-04-29 11:00:00'),
('rrrr4444',16,'부모님 모시고 갔는데 너무 좋아하셨어요. 특별한 날에 모시고 가기 좋은 식당이에요.',5,'2025-05-01',FALSE,0,'2025-05-02 12:00:00'),
('qqqq1111',17,'수제버거 패티가 두껍고 육즙이 넘쳐요. 이태원에서 이런 버거집 찾던 분들 강추!',5,'2025-05-03',FALSE,0,'2025-05-04 13:00:00'),
('wwww2222',17,'더블 패티 버거 도전했는데 배가 너무 불렀어요. 그래도 맛있어서 후회 없어요.',4,'2025-05-05',FALSE,0,'2025-05-06 14:00:00'),
('eeee3333',18,'평양냉면 진짜 정통이에요. 처음엔 심심한 듯해도 먹을수록 그 맛이 느껴져요.',5,'2025-05-08',TRUE,0,'2025-05-09 11:00:00'),
('rrrr4444',18,'물냉면 국물이 맑고 시원해요. 여름에 자꾸 생각날 것 같은 맛이에요.',4,'2025-05-10',FALSE,0,'2025-05-11 12:00:00'),
('qqqq1111',19,'해장으로 최고예요. 진한 국물에 순대 듬뿍 넣어서 따뜻하게 먹으니 살 것 같아요.',4,'2025-05-12',TRUE,0,'2025-05-13 08:00:00'),
('wwww2222',19,'가격이 저렴한데 양이 엄청나요. 혼밥하기도 좋고 현지인이 추천할 만한 맛집입니다.',4,'2025-05-14',FALSE,0,'2025-05-15 09:00:00'),
('eeee3333',20,'해물탕 국물이 칼칼하고 시원해요. 낙지볶음도 매콤해서 아주 좋았어요.',5,'2025-05-16',TRUE,0,'2025-05-17 12:00:00'),
('rrrr4444',20,'신촌에서 이렇게 신선한 해물탕을 먹을 수 있다니 놀라웠어요. 재방문 의사 있습니다.',4,'2025-05-18',FALSE,0,'2025-05-19 13:00:00'),
('qqqq1111',6,'을지로 야경 보면서 먹는 곱창은 또 다른 맛이에요. 현지인이 추천할 만한 진짜 맛집이에요.',5,'2025-05-19',TRUE,0,'2025-05-20 18:00:00'),
('wwww2222',8,'파스타 종류가 다양해서 뭘 먹을지 고민됐어요. 알리오올리오도 마늘향 살아있어서 맛있었어요.',4,'2025-05-20',FALSE,0,'2025-05-21 11:00:00'),
('eeee3333',11,'떡볶이 단골이 됐어요. 어릴 때 먹던 그 맛이 그대로 살아있어서 감동받았어요.',5,'2025-05-21',TRUE,0,'2025-05-22 14:00:00'),
('rrrr4444',13,'라멘 한 그릇 먹고 나서도 또 생각나요. 강남 직장인들 점심 맛집으로 강력 추천합니다.',4,'2025-05-22',FALSE,0,'2025-05-23 12:00:00'),
('qqqq1111',14,'성수동 데이트 코스로 완벽한 곳이에요. 스테이크 퀄리티가 파인다이닝 수준이에요.',5,'2025-05-23',TRUE,0,'2025-05-24 19:00:00'),
('wwww2222',12,'회 퀄리티가 정말 높아요. 노량진 수산시장 직접 가서 사는 것보다 편하고 맛있어요.',5,'2025-05-24',FALSE,0,'2025-05-25 11:00:00'),
('eeee3333',7,'친구들이랑 치맥 한 번 했는데 너무 즐거웠어요. 건대 대표 치맥 맛집으로 인정합니다.',4,'2025-05-25',FALSE,0,'2025-05-26 18:00:00'),
('rrrr4444',5,'종로 노포의 감성이 느껴지는 곳이에요. 저렴한 가격에 맛있는 삼겹살 먹을 수 있어서 좋아요.',4,'2025-05-26',FALSE,0,'2025-05-27 17:00:00'),
('qqqq1111',2,'성수동 나들이 코스로 딱이에요. 사진도 잘 나오고 커피도 맛있어서 자주 오게 될 것 같아요.',4,'2025-05-27',FALSE,0,'2025-05-28 10:00:00'),
('wwww2222',4,'초밥 퀄리티 대비 가격이 합리적이에요. 잠실 롯데타워 구경하고 초밥 먹기 딱 좋아요.',4,'2025-05-28',FALSE,0,'2025-05-29 13:00:00');

-- review_menu_tbl
INSERT INTO review_menu_tbl (review_no, menu_name) VALUES
(1,'한우 등심 1인분'),(1,'냉면'),
(2,'한우 갈비 1인분'),
(3,'아보카도 토스트'),(3,'아메리카노'),
(4,'에그베네딕트'),(4,'아메리카노'),
(5,'마라탕 소'),(5,'마라샹궈'),
(6,'마라탕 대'),
(7,'연어초밥 세트'),(7,'초밥 10피스'),
(8,'초밥 10피스'),(8,'우동'),
(9,'삼겹살 1인분'),(9,'볶음밥'),
(10,'목살 1인분'),(10,'볶음밥'),
(11,'곱창 1인분'),(11,'대창 1인분'),
(12,'모둠구이 2인분'),(12,'볶음밥'),
(13,'후라이드 치킨'),(13,'생맥주 500cc'),
(14,'양념 치킨'),(14,'감자튀김'),
(15,'까르보나라'),
(16,'알리오올리오'),(16,'마르게리타 피자'),
(17,'킹크랩 1kg'),(17,'랍스터 세트'),
(18,'랍스터 세트'),(18,'성게알 덮밥'),
(19,'타코 3개'),(19,'나초'),
(20,'부리토'),
(21,'떡볶이'),(21,'순대'),
(22,'떡볶이'),(22,'튀김 5개'),
(23,'모둠 회'),(23,'매운탕'),
(24,'광어 회 200g'),(24,'매운탕'),
(25,'돈코츠 라멘'),(25,'교자 6개'),
(26,'쇼유 라멘'),(26,'교자 6개'),
(27,'채끝 스테이크'),(27,'샐러드'),
(28,'등심 스테이크'),(28,'리조또'),
(29,'짬뽕'),
(30,'짜장면'),(30,'탕수육 소'),
(31,'한정식 코스 B'),
(32,'갈비찜 정식'),
(33,'클래식 버거'),(33,'어니언링'),
(34,'더블 패티 버거'),(34,'밀크셰이크'),
(35,'물냉면'),(35,'평양식 만두'),
(36,'비빔냉면'),
(37,'순대국밥'),
(38,'섞어 순대국밥'),(38,'순대 한접시'),
(39,'해물탕 2인'),(39,'낙지볶음'),
(40,'해물탕 3인'),
(41,'곱창 1인분'),(41,'볶음밥'),
(42,'알리오올리오'),
(43,'떡볶이'),(43,'어묵'),
(44,'돈코츠 라멘'),
(45,'채끝 스테이크'),
(46,'연어 회 200g'),(46,'매운탕'),
(47,'후라이드 치킨'),
(48,'목살 1인분'),
(49,'아보카도 토스트'),
(50,'초밥 10피스'),(50,'우동');

-- review_tags_tbl
INSERT INTO review_tags_tbl (review_no, tag_name) VALUES
(1,'현지인추천'),(1,'분위기좋음'),
(2,'데이트'),(2,'재방문의사'),
(3,'데이트'),(3,'분위기좋음'),
(4,'분위기좋음'),(4,'재방문의사'),
(5,'현지인추천'),(5,'재방문의사'),
(6,'가성비'),(6,'혼밥'),
(7,'가성비'),(7,'재방문의사'),
(8,'데이트'),(8,'가성비'),
(9,'현지인추천'),(9,'재방문의사'),
(10,'가성비'),(10,'분위기좋음'),
(11,'현지인추천'),(11,'분위기좋음'),
(12,'재방문의사'),(12,'현지인추천'),
(13,'가성비'),(13,'가족외식'),
(14,'가성비'),(14,'혼밥'),
(15,'데이트'),(15,'재방문의사'),
(16,'데이트'),(16,'분위기좋음'),
(17,'분위기좋음'),(17,'재방문의사'),
(18,'가성비'),(18,'가족외식'),
(19,'데이트'),(19,'분위기좋음'),
(20,'데이트'),(20,'가성비'),
(21,'가성비'),(21,'현지인추천'),
(22,'혼밥'),(22,'가성비'),
(23,'가족외식'),(23,'재방문의사'),
(24,'가족외식'),(24,'현지인추천'),
(25,'현지인추천'),(25,'재방문의사'),
(26,'혼밥'),(26,'가성비'),
(27,'데이트'),(27,'분위기좋음'),
(28,'데이트'),(28,'재방문의사'),
(29,'혼밥'),(29,'가성비'),
(30,'가성비'),(30,'혼밥'),
(31,'가족외식'),(31,'재방문의사'),
(32,'가족외식'),(32,'분위기좋음'),
(33,'혼밥'),(33,'가성비'),
(34,'가성비'),(34,'재방문의사'),
(35,'현지인추천'),(35,'재방문의사'),
(36,'혼밥'),(36,'가성비'),
(37,'가성비'),(37,'혼밥'),
(38,'가성비'),(38,'현지인추천'),
(39,'가족외식'),(39,'재방문의사'),
(40,'데이트'),(40,'분위기좋음'),
(41,'현지인추천'),(41,'분위기좋음'),
(42,'데이트'),(42,'재방문의사'),
(43,'가성비'),(43,'혼밥'),
(44,'혼밥'),(44,'가성비'),
(45,'데이트'),(45,'분위기좋음'),
(46,'가족외식'),(46,'현지인추천'),
(47,'가성비'),(47,'혼밥'),
(48,'가성비'),(48,'현지인추천'),
(49,'데이트'),(49,'분위기좋음'),
(50,'가성비'),(50,'재방문의사');

-- review_images_tbl
INSERT INTO review_images_tbl (review_no, image_url) VALUES
(1,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review1.jpg'),
(2,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review2.jpg'),
(3,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review3.jpg'),
(4,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review4.jpg'),
(5,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review5.jpg'),
(6,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review6.jpg'),
(7,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review7.jpg'),
(8,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review8.jpg'),
(9,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review9.jpg'),
(10,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review10.jpg'),
(11,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review11.jpg'),
(12,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review12.jpg'),
(13,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review13.jpg'),
(14,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review14.jpg'),
(15,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review15.jpg'),
(16,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review16.jpg'),
(17,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review17.jpg'),
(18,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review18.jpg'),
(19,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review19.jpg'),
(20,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review20.jpg'),
(21,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review21.jpg'),
(22,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review22.jpg'),
(23,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review23.jpg'),
(24,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review24.jpg'),
(25,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review25.jpg'),
(26,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review26.jpg'),
(27,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review27.jpg'),
(28,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review28.jpg'),
(29,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review29.jpg'),
(30,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review30.jpg'),
(31,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review31.jpg'),
(32,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review32.jpg'),
(33,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review33.jpg'),
(34,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review34.jpg'),
(35,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review35.jpg'),
(36,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review36.jpg'),
(37,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review37.jpg'),
(38,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review38.jpg'),
(39,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review39.jpg'),
(40,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review40.jpg'),
(41,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review41.jpg'),
(42,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review42.jpg'),
(43,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review43.jpg'),
(44,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review44.jpg'),
(45,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review45.jpg'),
(46,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review46.jpg'),
(47,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review47.jpg'),
(48,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review48.jpg'),
(49,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review49.jpg'),
(50,'https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/review/review50.jpg');

-- rest_like_tbl (40건, 중복금지)
INSERT INTO rest_like_tbl (member_id, rest_no) VALUES
('qqqq1111',1),('qqqq1111',2),('qqqq1111',3),('qqqq1111',4),('qqqq1111',5),
('qqqq1111',6),('qqqq1111',7),('qqqq1111',8),('qqqq1111',9),('qqqq1111',10),
('wwww2222',1),('wwww2222',3),('wwww2222',5),('wwww2222',6),('wwww2222',8),
('wwww2222',10),('wwww2222',11),('wwww2222',12),('wwww2222',13),('wwww2222',14),
('eeee3333',2),('eeee3333',4),('eeee3333',6),('eeee3333',8),('eeee3333',9),
('eeee3333',11),('eeee3333',13),('eeee3333',15),('eeee3333',16),('eeee3333',17),
('rrrr4444',1),('rrrr4444',4),('rrrr4444',7),('rrrr4444',9),('rrrr4444',12),
('rrrr4444',14),('rrrr4444',16),('rrrr4444',18),('rrrr4444',19),('rrrr4444',20);

-- review_like_tbl (80건, 중복금지)
INSERT INTO review_like_tbl (review_no, member_id) VALUES
(1,'wwww2222'),(1,'eeee3333'),(1,'rrrr4444'),
(2,'qqqq1111'),(2,'eeee3333'),(2,'rrrr4444'),
(3,'qqqq1111'),(3,'wwww2222'),(3,'rrrr4444'),
(4,'qqqq1111'),(4,'wwww2222'),(4,'eeee3333'),
(5,'wwww2222'),(5,'eeee3333'),(5,'rrrr4444'),
(6,'qqqq1111'),(6,'eeee3333'),
(7,'qqqq1111'),(7,'wwww2222'),(7,'rrrr4444'),
(8,'qqqq1111'),(8,'wwww2222'),(8,'eeee3333'),
(9,'wwww2222'),(9,'eeee3333'),
(10,'qqqq1111'),(10,'eeee3333'),(10,'rrrr4444'),
(11,'qqqq1111'),(11,'wwww2222'),(11,'rrrr4444'),
(12,'qqqq1111'),(12,'wwww2222'),(12,'eeee3333'),
(13,'wwww2222'),(13,'eeee3333'),(13,'rrrr4444'),
(14,'qqqq1111'),(14,'eeee3333'),
(15,'qqqq1111'),(15,'wwww2222'),(15,'rrrr4444'),
(16,'qqqq1111'),(16,'wwww2222'),(16,'eeee3333'),
(17,'wwww2222'),(17,'eeee3333'),
(18,'qqqq1111'),(18,'eeee3333'),(18,'rrrr4444'),
(19,'qqqq1111'),(19,'wwww2222'),(19,'rrrr4444'),
(20,'qqqq1111'),(20,'wwww2222'),(20,'eeee3333'),
(21,'wwww2222'),(21,'rrrr4444'),
(22,'qqqq1111'),(22,'eeee3333'),
(23,'wwww2222'),(23,'rrrr4444'),
(24,'qqqq1111'),(24,'eeee3333'),
(25,'wwww2222'),(25,'rrrr4444'),
(26,'qqqq1111'),(26,'eeee3333'),
(27,'wwww2222'),(27,'rrrr4444'),
(28,'qqqq1111');

-- review_comment_tbl (댓글 40개, 대댓글 20개)
INSERT INTO review_comment_tbl (review_no, member_id, parent_comment, depth, content, com_status, created_at) VALUES
(1,'wwww2222',NULL,0,'저도 여기 다녀왔는데 정말 맛있더라고요! 다음에 또 가려고요.',0,'2025-01-17 10:00:00'),
(1,'eeee3333',NULL,0,'한우 등심 진짜 맛있죠. 저는 갈비가 더 좋더라고요.',0,'2025-01-17 11:00:00'),
(2,'rrrr4444',NULL,0,'저도 이 집 한우 갈비 먹어봤는데 완전 부드러워요.',0,'2025-01-22 10:00:00'),
(3,'qqqq1111',NULL,0,'성수 카페 분위기 진짜 최고예요!',0,'2025-02-05 09:00:00'),
(4,'eeee3333',NULL,0,'에그베네딕트 진짜 맛있어 보이네요. 저도 꼭 먹어봐야겠어요.',0,'2025-02-12 10:00:00'),
(5,'rrrr4444',NULL,0,'홍대 마라탕 맛있기로 유명한 집이죠! 저도 즐겨 가요.',0,'2025-02-17 12:00:00'),
(6,'qqqq1111',NULL,0,'매운 거 못 먹는데 순한 맛으로 먹어도 맛있나요?',0,'2025-02-20 14:00:00'),
(7,'eeee3333',NULL,0,'잠실 초밥 진짜 퀄리티 높더라고요. 저도 좋아하는 집이에요.',0,'2025-02-22 11:00:00'),
(8,'wwww2222',NULL,0,'점심 특선 메뉴 있는지 저도 물어봤는데 없다고 하더라고요 아쉬워요.',0,'2025-02-27 12:00:00'),
(9,'eeee3333',NULL,0,'종로 삼겹살 진짜 연탄불 맛이 살아있어요. 강추예요!',0,'2025-03-04 18:00:00'),
(10,'rrrr4444',NULL,0,'볶음밥 추가는 필수죠! 꿀팁 공유해주셔서 감사해요.',0,'2025-03-07 19:00:00'),
(11,'qqqq1111',NULL,0,'을지로 곱창 저도 진짜 좋아하는데 항상 줄이 길더라고요.',0,'2025-03-10 17:00:00'),
(12,'wwww2222',NULL,0,'곱창 잡내 없는 게 진짜 중요한데 여기는 정말 잘 잡아주죠.',0,'2025-03-12 18:00:00'),
(13,'eeee3333',NULL,0,'건대 치맥 저도 자주 가는데 반가워요!',0,'2025-03-14 17:00:00'),
(14,'qqqq1111',NULL,0,'양념 치킨 강추예요. 소스가 진짜 맛있어요.',0,'2025-03-17 18:00:00'),
(15,'rrrr4444',NULL,0,'신촌 파스타 생면이라 정말 쫄깃하죠. 까르보나라 진짜 크리미해요.',0,'2025-03-20 12:00:00'),
(16,'wwww2222',NULL,0,'데이트 코스로 완벽한 것 같아요. 저도 가보고 싶어요.',0,'2025-03-22 13:00:00'),
(17,'eeee3333',NULL,0,'여의도 한강 뷰 보면서 랍스터 먹는 게 꿈이에요.',0,'2025-03-24 11:00:00'),
(18,'rrrr4444',NULL,0,'해산물 뷔페 가성비 괜찮은가요? 메뉴 종류 많나요?',0,'2025-03-27 12:00:00'),
(19,'qqqq1111',NULL,0,'이태원 멕시칸 저도 가봤는데 타코 진짜 맛있더라고요!',0,'2025-03-30 13:00:00'),
(20,'wwww2222',NULL,0,'부리또 사이즈가 엄청 크더라고요. 든든하게 먹었어요.',0,'2025-04-03 12:00:00'),
(21,'rrrr4444',NULL,0,'망원 떡볶이 진짜 할머니 손맛이죠. 오래된 맛집이에요.',0,'2025-04-05 14:00:00'),
(22,'qqqq1111',NULL,0,'떡볶이 국물이 진하고 달콤한 게 특징이에요.',0,'2025-04-07 13:00:00'),
(23,'wwww2222',NULL,0,'노량진 회 진짜 싱싱하죠. 새벽에 들어온 거라 더 신선해요.',0,'2025-04-10 11:00:00'),
(24,'eeee3333',NULL,0,'매운탕 국물이 진하고 시원한 게 최고예요.',0,'2025-04-12 12:00:00'),
(25,'rrrr4444',NULL,0,'강남 라멘바 돈코츠 육수 진짜 진하더라고요!',0,'2025-04-14 12:00:00'),
(26,'qqqq1111',NULL,0,'쇼유 라멘도 맛있죠. 저는 쇼유파예요.',0,'2025-04-17 13:00:00'),
(27,'wwww2222',NULL,0,'성수 스테이크 진짜 파인다이닝급이에요.',0,'2025-04-20 18:00:00'),
(28,'eeee3333',NULL,0,'리조또랑 같이 먹으면 더 맛있어요.',0,'2025-04-22 19:00:00'),
(29,'rrrr4444',NULL,0,'홍대 중국집 짬뽕 불맛 진짜예요!',0,'2025-04-24 11:00:00'),
(30,'qqqq1111',NULL,0,'짜장 짬뽕 고민될 때 짬짜면 되는지 물어보세요.',0,'2025-04-27 12:00:00'),
(31,'wwww2222',NULL,0,'한정식 코스 정말 정성스럽더라고요. 부모님 모시고 가기 딱이에요.',0,'2025-04-30 11:00:00'),
(32,'eeee3333',NULL,0,'갈비찜 정식도 맛있더라고요. 메뉴 다 잘 나와요.',0,'2025-05-03 12:00:00'),
(33,'rrrr4444',NULL,0,'이태원 수제버거 진짜 맛있더라고요! 패티가 두꺼워요.',0,'2025-05-05 13:00:00'),
(34,'qqqq1111',NULL,0,'더블 패티 버거 도전해보고 싶어요.',0,'2025-05-07 14:00:00'),
(35,'wwww2222',NULL,0,'평양냉면 진짜 맛이 은은하죠. 처음엔 심심하다고 느끼는 분들도 있어요.',0,'2025-05-10 11:00:00'),
(36,'eeee3333',NULL,0,'비빔냉면도 매콤해서 맛있어요.',0,'2025-05-12 12:00:00'),
(37,'rrrr4444',NULL,0,'건대 순대국밥 해장으로 최고예요!',0,'2025-05-14 08:00:00'),
(38,'qqqq1111',NULL,0,'순대 한접시 따로 추가해서 먹으면 더 맛있어요.',0,'2025-05-16 09:00:00'),
(39,'wwww2222',NULL,0,'신촌 해물탕 국물 진짜 시원하더라고요.',0,'2025-05-18 12:00:00'),
(40,'eeee3333',NULL,0,'낙지볶음이랑 같이 먹으면 환상의 조합이에요.',0,'2025-05-20 13:00:00');

-- 대댓글 20개 (parent_comment는 위 댓글의 comment_no 1~40 참조)
INSERT INTO review_comment_tbl (review_no, member_id, parent_comment, depth, content, com_status, created_at) VALUES
(1,'rrrr4444',1,1,'저도 다음 달에 예약해놨어요! 기대돼요.',0,'2025-01-18 10:00:00'),
(1,'qqqq1111',2,1,'갈비도 정말 부드럽죠. 둘 다 드시는 분들도 많아요.',0,'2025-01-18 12:00:00'),
(3,'rrrr4444',4,1,'주말엔 웨이팅 있으니 평일 가시는 게 편해요.',0,'2025-02-06 10:00:00'),
(5,'wwww2222',6,1,'네 순한 맛으로도 충분히 맛있어요! 걱정 마세요.',0,'2025-02-21 15:00:00'),
(7,'rrrr4444',8,1,'저도 점심 특선 없어서 아쉬웠어요. 그냥 세트 메뉴 시키는 게 나아요.',0,'2025-02-28 13:00:00'),
(9,'wwww2222',10,1,'볶음밥 꿀팁 저도 몰랐는데 이제 꼭 추가해야겠어요.',0,'2025-03-08 20:00:00'),
(11,'eeee3333',12,1,'잡내 없는 곱창집 진짜 귀하죠. 여기가 레전드예요.',0,'2025-03-13 19:00:00'),
(13,'wwww2222',14,1,'양념 치킨 소스 진짜 맛있어요. 간장소스도 맛있으니 반반 추천해요.',0,'2025-03-18 19:00:00'),
(15,'qqqq1111',16,1,'저도 파트너랑 갔는데 완전 좋아했어요. 분위기 짱이에요.',0,'2025-03-23 14:00:00'),
(17,'qqqq1111',18,1,'네 뷔페 가성비 괜찮고 게, 새우, 조개 등 다양하게 있어요.',0,'2025-03-28 13:00:00'),
(21,'wwww2222',22,1,'30년이 넘은 집이라 역사가 있는 맛집이에요.',0,'2025-04-08 15:00:00'),
(23,'rrrr4444',24,1,'매운탕 국물에 공기밥 비비면 진짜 맛있어요.',0,'2025-04-13 13:00:00'),
(25,'wwww2222',26,1,'쇼유 라멘도 맛있죠. 저는 둘 다 좋아요.',0,'2025-04-18 14:00:00'),
(27,'rrrr4444',28,1,'리조또 진짜 크리미하더라고요. 같이 드세요!',0,'2025-04-23 20:00:00'),
(29,'eeee3333',30,1,'짬짜면 됩니다! 둘 다 즐기세요.',0,'2025-04-28 13:00:00'),
(31,'rrrr4444',32,1,'가족분들 너무 좋아하실 것 같아요. 꼭 가보세요.',0,'2025-05-04 13:00:00'),
(33,'wwww2222',34,1,'더블 패티 두 분이 나눠 드시면 딱 좋아요.',0,'2025-05-08 15:00:00'),
(35,'rrrr4444',36,1,'비빔냉면이랑 물냉면 반씩 시키는 것도 좋아요.',0,'2025-05-13 13:00:00'),
(37,'wwww2222',38,1,'순대 따로 시키면 더 맛있죠. 꿀팁이에요!',0,'2025-05-17 10:00:00'),
(39,'rrrr4444',40,1,'낙지볶음 매운 편이니 매운 거 못 드시면 물어보고 시키세요.',0,'2025-05-21 14:00:00');

-- review_report_tbl (5건)
INSERT INTO review_report_tbl (member_id, review_no, reason, detail, report_status) VALUES
('qqqq1111',15,'허위정보','메뉴 가격이 실제와 다르게 기재되어 있어요.',0),
('wwww2222',23,'광고스팸','특정 서비스 홍보 내용이 포함되어 있어요.',0),
('eeee3333',31,'욕설비방','리뷰 내용에 불쾌한 표현이 포함되어 있어요.',1),
('rrrr4444',42,'기타','리뷰 내용이 해당 식당과 관련이 없어요.',0),
('qqqq1111',47,'허위정보','실제 방문하지 않고 작성된 것 같아요.',2);

-- review_comment_report_tbl (5건)
INSERT INTO review_comment_report_tbl (member_id, comment_no, reason, detail, report_status) VALUES
('wwww2222',3,'욕설비방','댓글에 불쾌한 표현이 있습니다.',0),
('eeee3333',7,'광고스팸','홍보성 댓글입니다.',0),
('rrrr4444',15,'허위정보','잘못된 정보를 전달하고 있어요.',1),
('qqqq1111',22,'기타','관련 없는 내용입니다.',0),
('wwww2222',35,'욕설비방','타인을 비하하는 내용이 있어요.',2);

-- rest_report_tbl (5건)
INSERT INTO rest_report_tbl (member_id, rest_no, reason, detail, report_status) VALUES
('eeee3333',3,'허위정보','영업시간이 실제와 다르게 등록되어 있어요.',0),
('rrrr4444',7,'광고스팸','식당 정보가 과장 광고 형태로 등록되어 있어요.',0),
('qqqq1111',12,'욕설비방','식당 설명에 비방성 내용이 포함되어 있어요.',1),
('wwww2222',16,'기타','중복 등록된 식당인 것 같아요.',0),
('eeee3333',19,'허위정보','주소가 잘못 등록되어 있어요.',2);

-- board_place_tbl (10개)
INSERT INTO board_place_tbl (PLACE_NAME, ADDRESS_NAME, PLACE_LAT, PLACE_LNG) VALUES
('강남역','서울 강남구 강남대로 396',37.4979,127.0276),
('홍대입구역','서울 마포구 양화로 160',37.5572,126.9236),
('잠실역','서울 송파구 올림픽로 240',37.5133,127.1000),
('서울역','서울 중구 한강대로 405',37.5547,126.9706),
('여의도공원','서울 영등포구 여의공원로 68',37.5226,126.9244),
('성수동','서울 성동구 성수이로 114',37.5443,127.0557),
('을지로입구역','서울 중구 을지로 100',37.5659,126.9876),
('건대입구역','서울 광진구 능동로 90',37.5403,127.0698),
('신촌역','서울 서대문구 신촌로 83',37.5596,126.9368),
('이태원역','서울 용산구 이태원로 177',37.5346,126.9946);

-- board_tbl (여행후기 10개, 자유게시글 10개)
INSERT INTO board_tbl (MEMBER_NO, BOARD_CATEGORY, BOARD_TITLE, BOARD_CONTENT, BOARD_THUMB, BOARD_DATE, BOARD_STATUS, PLACE_NO, BOARD_VIEW) VALUES
(1,1,'강남 한우 맛집 투어 후기','오랜만에 강남에서 한우 투어를 했습니다. 강남 소고기마당에서 등심과 갈비를 먹었는데 퀄리티가 정말 최상급이었어요. 가격은 있지만 특별한 날에 딱 좋은 곳이었습니다. 서비스도 친절해서 만족도 100점이었어요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board1.jpg','2025-01-20 10:00:00',1,1,350),
(2,1,'성수동 브런치 카페 나들이','성수동에 새로 생긴 브런치 카페들을 돌아다니며 하루를 보냈어요. 성수 브런치카페에서 에그베네딕트와 아메리카노를 먹었는데 인테리어도 예쁘고 음식도 맛있었습니다. 사진 찍기도 너무 좋아서 SNS용 사진 찍기 완벽한 장소예요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board2.jpg','2025-02-05 11:00:00',1,6,280),
(3,1,'홍대 밤 먹방 투어','홍대에서 친구들이랑 밤새 먹방 투어를 했어요. 마라탕, 떡볶이, 치킨까지 먹으면서 홍대의 밤을 즐겼습니다. 특히 홍대 마라탕집에서 마라샹궈와 마라탕을 같이 먹었는데 불맛이 살아있어서 진짜 맛있었어요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board3.jpg','2025-02-15 12:00:00',1,2,420),
(4,1,'잠실 롯데타워 근처 맛집 탐방','잠실 롯데타워 구경하고 근처 맛집들을 탐방했어요. 잠실 초밥천국에서 연어초밥 세트를 먹었는데 신선도가 최고였습니다. 가격도 합리적이고 서비스도 친절해서 잠실 방문하시면 꼭 들러보세요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board4.jpg','2025-03-01 13:00:00',1,3,195),
(1,1,'종로 노포 음식점 탐방','종로 골목골목을 돌아다니며 오래된 맛집들을 탐방했어요. 종로 삼겹살집에서 연탄불 삼겹살을 먹고 종로 냉면집에서 평양냉면으로 마무리했습니다. 역사와 전통이 살아있는 종로의 맛집들은 서울의 보물 같은 존재예요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board5.jpg','2025-03-10 14:00:00',1,1,310),
(2,1,'을지로 야간 탐방 후기','을지로 인쇄골목 구경하고 저녁에 곱창 먹으러 갔어요. 을지로 곱창골목에서 대창과 곱창을 먹었는데 정말 맛있었어요. 을지로의 감성 있는 분위기와 맛있는 곱창의 조합이 최고였습니다. 다음에 또 오고 싶어요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board6.jpg','2025-03-20 15:00:00',1,7,380),
(3,1,'노량진 수산시장 근처 회 맛집','노량진 수산시장 방문 후 근처 노량진 회센터에서 모둠회를 먹었어요. 직접 수산시장에서 재료를 가져와 서빙해주는 느낌이라 신선도가 달랐어요. 매운탕까지 먹으니 정말 완벽한 해산물 식사였습니다.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board7.jpg','2025-04-05 11:00:00',1,1,245),
(4,1,'이태원 세계 음식 거리 탐방','이태원에서 다양한 나라의 음식을 먹어봤어요. 멕시칸, 이탈리안, 수제버거까지 한나절에 다 경험했습니다. 이태원은 정말 서울 속의 세계 음식 거리예요. 특히 이태원 멕시칸에서 먹은 타코가 진짜 정통 맛이었어요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board8.jpg','2025-04-15 12:00:00',1,10,430),
(1,1,'신촌 연세대 앞 맛집 코스','신촌 연세대 거리에 있는 맛집들을 돌아다녔어요. 신촌 파스타집에서 까르보나라를 먹고 신촌 해물탕에서 저녁을 마무리했습니다. 두 곳 모두 퀄리티가 높고 가격도 합리적이어서 신촌 방문시 추천 코스예요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board9.jpg','2025-04-25 13:00:00',1,9,270),
(2,1,'여의도 한강변 맛집 투어','봄날 여의도 한강공원에서 피크닉하고 여의도 해산물뷔페에서 저녁 식사를 했어요. 한강 뷰를 보며 신선한 해산물을 먹으니 정말 행복했어요. 봄 여의도 여행 코스로 강력 추천합니다.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board10.jpg','2025-05-01 14:00:00',1,5,390),
(3,2,'요즘 강남 핫플 어디가 있나요?','강남에 새로 생긴 맛집이나 카페 정보 공유해주세요. 친구들이랑 주말에 강남 나들이 계획 중인데 좋은 곳 있으면 댓글로 알려주세요!','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board11.jpg','2025-01-25 10:00:00',1,1,185),
(4,2,'성수동 카페 추천 부탁드려요','성수동 갈 때마다 카페를 들르는데 아직 못 가본 카페가 많아요. 성수동 감성 카페 추천해주세요. 인테리어 예쁘고 커피 맛있는 곳 위주로 알려주시면 감사하겠습니다.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board12.jpg','2025-02-10 11:00:00',1,6,220),
(1,2,'홍대 웨이팅 없는 맛집 공유해요','홍대는 항상 웨이팅이 길어서 힘들어요. 웨이팅 없이 바로 들어갈 수 있는 맛집 있으면 공유해주세요. 특히 야식으로 먹기 좋은 곳이면 더 좋아요!','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board13.jpg','2025-02-20 12:00:00',1,2,155),
(2,2,'잠실 주변 데이트 코스 추천','잠실 롯데타워 구경하고 데이트 코스 짜고 싶은데 추천 해주실 분 있나요? 저녁 식사까지 포함한 코스면 더 좋겠어요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board14.jpg','2025-03-05 13:00:00',1,3,340),
(3,2,'서울역 주변 맛집 정보 공유','출장으로 서울역 근처에 자주 가는데 매번 가는 곳만 가게 되어요. 서울역 주변 새로운 맛집 정보 있으신 분 공유해주시면 감사합니다.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board15.jpg','2025-03-15 14:00:00',1,4,175),
(4,2,'을지로 분위기 좋은 술집 추천','을지로 힙한 분위기 좋은 곳에서 친구들이랑 술 한잔 하고 싶은데 추천해주세요. 음식도 맛있고 분위기도 좋은 곳이면 더 좋겠어요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board16.jpg','2025-04-01 15:00:00',1,7,265),
(1,2,'건대 새벽 해장 맛집 알려주세요','건대 근처에 살고 있는데 새벽에 해장하러 가기 좋은 곳 있나요? 24시간 운영하는 곳이면 더 좋겠어요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board17.jpg','2025-04-10 16:00:00',1,8,140),
(2,2,'신촌 혼밥하기 좋은 식당','신촌에서 자취하고 있는데 혼밥하기 좋은 식당 추천해주세요. 혼자 가도 눈치 안 보이고 맛있는 곳 알려주시면 감사해요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board18.jpg','2025-04-20 17:00:00',1,9,195),
(3,2,'이태원 브런치 장소 추천','이태원에서 주말 브런치 먹을 만한 곳 있나요? 외국 분위기 나는 곳이면 더 좋겠어요. 커피도 맛있는 곳으로 추천해주세요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board19.jpg','2025-05-01 18:00:00',1,10,230),
(4,2,'여의도 점심 가성비 맛집','여의도에서 직장인 점심 먹기 좋은 가성비 맛집 공유해주세요. 양도 많고 빠르게 먹을 수 있는 곳이면 좋겠어요.','https://dummy-bucket.s3.ap-northeast-2.amazonaws.com/board/board20.jpg','2025-05-10 19:00:00',1,5,310);

-- board_like_tbl (50건)
INSERT INTO board_like_tbl (MEMBER_NO, BOARD_NO) VALUES
(1,2),(1,3),(1,4),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),
(2,1),(2,3),(2,4),(2,5),(2,7),(2,8),(2,9),(2,10),(2,13),(2,14),
(3,1),(3,2),(3,4),(3,5),(3,6),(3,8),(3,9),(3,10),(3,15),(3,16),
(4,1),(4,2),(4,3),(4,5),(4,6),(4,7),(4,9),(4,10),(4,17),(4,18),
(1,17),(1,18),(1,19),(1,20),(2,15),(2,16),(2,19),(2,20),(3,19),(3,20);

-- board_comment_tbl (40건)
INSERT INTO board_comment_tbl (BOARD_COMMENT_CONTENT, BOARD_COMMENT_DATE, MEMBER_NO, BOARD_COMMENT_STATUS, BOARD_NO) VALUES
('정말 좋은 후기 감사해요! 저도 꼭 가봐야겠어요.','2025-01-21 10:00:00',2,1,1),
('한우 맛집 저도 알아요! 거기 갈비도 맛있어요.','2025-01-22 11:00:00',3,1,1),
('강남 한우 진짜 최고죠. 저도 좋아하는 곳이에요.','2025-01-23 12:00:00',4,1,1),
('성수동 카페 분위기 진짜 예쁘죠. 저도 자주 가요.','2025-02-06 09:00:00',1,1,2),
('에그베네딕트 진짜 맛있어 보여요!','2025-02-07 10:00:00',4,1,2),
('홍대 마라탕 줄 서서 먹을 만한 가치 있어요!','2025-02-16 12:00:00',2,1,3),
('마라샹궈랑 같이 먹으면 더 맛있어요!','2025-02-17 13:00:00',4,1,3),
('잠실 초밥 저도 가봤는데 신선도 진짜 최고예요.','2025-03-02 13:00:00',1,1,4),
('롯데타워 구경하고 초밥이라니 완벽한 코스네요!','2025-03-03 14:00:00',3,1,4),
('종로 노포 분위기 진짜 좋아요. 평양냉면도 맛있고요.','2025-03-11 14:00:00',3,1,5),
('저도 종로 삼겹살 정말 좋아해요! 볶음밥도 맛있죠.','2025-03-12 15:00:00',4,1,5),
('을지로 곱창 진짜 명소죠. 줄 서서 먹을 만해요.','2025-03-21 15:00:00',1,1,6),
('을지로 감성 최고예요. 요즘 핫플이죠.','2025-03-22 16:00:00',4,1,6),
('노량진 회 진짜 신선하더라고요. 좋은 후기 감사해요.','2025-04-06 11:00:00',2,1,7),
('매운탕도 맛있죠. 전 거기 매운탕 팬이에요.','2025-04-07 12:00:00',4,1,7),
('이태원 멕시칸 타코 진짜 정통 맛이에요!','2025-04-16 12:00:00',1,1,8),
('이태원 세계 음식 투어 저도 하고 싶어요!','2025-04-17 13:00:00',3,1,8),
('신촌 파스타집 생면 진짜 쫄깃하죠!','2025-04-26 13:00:00',2,1,9),
('해물탕 국물 진짜 시원하더라고요.','2025-04-27 14:00:00',4,1,9),
('여의도 한강 뷰 보며 해산물 먹는 거 너무 좋아요.','2025-05-02 14:00:00',1,1,10),
('봄 여의도 최고예요. 저도 코스 따라해볼게요!','2025-05-03 15:00:00',3,1,10),
('강남 신규 맛집 알아요! 최근에 생긴 스시 오마카세 강추해요.','2025-01-26 10:00:00',1,1,11),
('강남역 근처 디저트 카페도 요즘 핫해요.','2025-01-27 11:00:00',4,1,11),
('성수동 ○○카페 진짜 예뻐요! 저도 최근에 다녀왔어요.','2025-02-11 11:00:00',2,1,12),
('성수동은 새로운 카페가 계속 생기는 것 같아요.','2025-02-12 12:00:00',3,1,12),
('홍대 웨이팅 없는 낙곱새 집이 있어요! 오픈 시간에 맞춰 가면 돼요.','2025-02-21 12:00:00',1,1,13),
('저는 홍대 중국집 웨이팅 없이 갈 수 있었어요.','2025-02-22 13:00:00',4,1,13),
('잠실 데이트 코스로 롯데월드 + 초밥 + 야경 어떠세요?','2025-03-06 13:00:00',2,1,14),
('석촌호수 벚꽃 시즌에 가면 더 좋을 것 같아요!','2025-03-07 14:00:00',3,1,14),
('서울역 근처 해장국 집 추천드려요. 아침부터 해요.','2025-03-16 14:00:00',1,1,15),
('서울역 한식 뷔페도 가성비 좋아요.','2025-03-17 15:00:00',4,1,15),
('을지로 야외 포장마차도 분위기 좋아요!','2025-04-02 15:00:00',2,1,16),
('을지로 3가 근처에 감성 바 많이 생겼어요.','2025-04-03 16:00:00',3,1,16),
('건대 순대국밥집 24시간 해요. 해장 완벽이에요!','2025-04-11 16:00:00',2,1,17),
('건대 근처 해장라멘도 새벽에 괜찮아요.','2025-04-12 17:00:00',3,1,17),
('신촌 라멘집 혼밥하기 딱 좋아요. 카운터 자리 있어요.','2025-04-21 17:00:00',1,1,18),
('신촌 분식집도 혼밥 편하게 할 수 있어요.','2025-04-22 18:00:00',4,1,18),
('이태원 브런치는 앤틱 느낌 나는 카페들 많아요.','2025-05-02 18:00:00',2,1,19),
('이태원 루프탑 카페도 브런치 메뉴 있어요!','2025-05-03 19:00:00',3,1,19),
('여의도 직장인 도시락 가게도 가성비 좋더라고요.','2025-05-11 19:00:00',1,1,20);

-- board_report_tbl (5건)
INSERT INTO board_report_tbl (MEMBER_NO, BOARD_NO, REPORT_REASON, REPORT_STATUS, DETAIL, REPORT_DATE) VALUES
(1,11,'광고스팸',0,'특정 식당 홍보 목적으로 작성된 것 같아요.','2025-01-28 10:00:00'),
(2,13,'허위정보',1,'실제와 다른 정보가 포함되어 있어요.','2025-02-23 12:00:00'),
(3,16,'욕설비방',0,'댓글에 불쾌한 내용이 있어요.','2025-04-05 15:00:00'),
(4,18,'기타',2,'게시글 내용이 주제와 맞지 않아요.','2025-04-23 18:00:00'),
(1,20,'광고스팸',0,'가게 직원이 홍보하는 것 같은 게시글이에요.','2025-05-12 19:00:00');

-- board_comment_report_tbl (5건)
INSERT INTO board_comment_report_tbl (MEMBER_NO, BOARD_COMMENT_NO, REPORT_REASON, REPORT_STATUS, DETAIL, REPORT_DATE) VALUES
(2,5,'욕설비방',0,'댓글에 불쾌한 표현이 있어요.','2025-02-08 10:00:00'),
(3,10,'광고스팸',1,'홍보성 댓글입니다.','2025-03-13 15:00:00'),
(4,15,'허위정보',0,'잘못된 정보를 담고 있어요.','2025-04-08 12:00:00'),
(1,22,'기타',2,'관련 없는 내용의 댓글이에요.','2025-01-28 11:00:00'),
(2,30,'욕설비방',0,'타인 비하 표현이 포함되어 있어요.','2025-03-08 14:00:00');

-- tag_tbl (10개)
INSERT INTO tag_tbl (tag_name) VALUES
('맛집'),('데이트'),('가족'),('혼밥'),('드라이브'),('야경'),('여행'),('카페'),('먹방'),('힐링');

-- travel_plan_tbl (15개)
INSERT INTO travel_plan_tbl (member_no, tplan_title, tplan_desc, tplan_region, tplan_days, tplan_status, tplan_total_price, tplan_view, tplan_like, created_at) VALUES
(1,'강남 한우 먹방 코스','강남에서 최고급 한우를 즐기는 먹방 여행 계획입니다.','강남',1,1,120000,150,25,'2025-01-10 10:00:00'),
(1,'성수 데이트 코스','성수동의 감성 카페와 맛집을 돌아다니는 데이트 코스입니다.','성수',1,1,85000,200,40,'2025-01-15 11:00:00'),
(1,'홍대 야식 투어','홍대의 다양한 야식 명소를 탐방하는 밤 투어입니다.','홍대',1,1,65000,180,35,'2025-01-20 12:00:00'),
(2,'서울 맛집 정복 1일 코스','서울의 각 지역 대표 맛집을 하루에 정복하는 계획입니다.','서울전체',1,1,150000,250,55,'2025-02-01 10:00:00'),
(2,'종로 노포 탐방','종로 골목의 오래된 맛집들을 탐방하는 역사 미식 여행입니다.','종로',1,1,70000,120,20,'2025-02-05 11:00:00'),
(2,'잠실 가족 나들이 코스','가족과 함께 잠실에서 즐기는 맛집 나들이 코스입니다.','잠실',1,1,180000,160,30,'2025-02-10 12:00:00'),
(3,'을지로 힙스터 투어','을지로의 개성 있는 맛집과 카페를 탐방하는 힙스터 코스입니다.','을지로',1,1,90000,220,45,'2025-02-15 10:00:00'),
(3,'강남 파인다이닝 투어','강남의 고급 레스토랑을 탐방하는 파인다이닝 코스입니다.','강남',1,1,250000,180,35,'2025-02-20 11:00:00'),
(3,'여의도 한강 피크닉 + 맛집','여의도 한강 피크닉과 인근 맛집을 즐기는 힐링 코스입니다.','여의도',1,1,100000,300,60,'2025-03-01 12:00:00'),
(4,'이태원 세계 음식 투어','이태원에서 다양한 나라의 음식을 즐기는 세계 미식 투어입니다.','이태원',1,1,80000,190,38,'2025-03-05 10:00:00'),
(4,'노량진 해산물 투어','노량진 수산시장과 인근 회집을 탐방하는 해산물 투어입니다.','노량진',1,1,120000,140,28,'2025-03-10 11:00:00'),
(4,'건대 야간 먹방 투어','건대 주변의 다양한 야간 먹방 명소를 탐방하는 코스입니다.','건대',1,1,75000,160,32,'2025-03-15 12:00:00'),
(1,'신촌 연세로 맛집 투어','신촌 연세로 주변의 다양한 맛집을 탐방하는 코스입니다.','신촌',1,1,95000,130,22,'2025-03-20 10:00:00'),
(2,'망원 분식 투어','망원동의 전통 분식집들을 탐방하는 코스입니다.','망원',1,1,45000,110,18,'2025-03-25 11:00:00'),
(3,'서울 2박 3일 미식 여행','서울 전역의 유명 맛집을 2박 3일 동안 탐방하는 종합 미식 여행입니다.','서울전체',3,1,450000,380,75,'2025-04-01 12:00:00');

-- plan_tag_tbl
INSERT INTO plan_tag_tbl (tplan_no, tag_no) VALUES
(1,1),(1,9),(1,7),
(2,2),(2,8),(2,1),
(3,9),(3,6),(3,1),
(4,1),(4,7),(4,9),
(5,1),(5,7),
(6,3),(6,1),(6,7),
(7,1),(7,6),(7,8),
(8,2),(8,1),
(9,10),(9,2),(9,1),
(10,7),(10,1),
(11,1),(11,9),
(12,9),(12,6),(12,1),
(13,1),(13,4),
(14,1),(14,4),
(15,1),(15,7),(15,9);

-- travel_schedule_tbl
INSERT INTO travel_schedule_tbl (tplan_no, tsche_day_no, tsche_order_no, rest_no) VALUES
(1,1,1,1),(1,1,2,13),(1,1,3,6),
(2,1,1,2),(2,1,2,14),(2,1,3,8),(2,1,4,3),
(3,1,1,3),(3,1,2,7),(3,1,3,11),
(4,1,1,1),(4,1,2,4),(4,1,3,8),(4,1,4,12),(4,1,5,9),
(5,1,1,5),(5,1,2,18),(5,1,3,6),
(6,1,1,16),(6,1,2,4),(6,1,3,9),(6,1,4,19),
(7,1,1,6),(7,1,2,13),(7,1,3,8),
(8,1,1,14),(8,1,2,1),(8,1,3,9),
(9,1,1,9),(9,1,2,20),(9,1,3,8),(9,1,4,2),
(10,1,1,10),(10,1,2,17),(10,1,3,6),
(11,1,1,12),(11,1,2,9),(11,1,3,19),
(12,1,1,7),(12,1,2,6),(12,1,3,11),(12,1,4,19),
(13,1,1,8),(13,1,2,20),(13,1,3,11),
(14,1,1,11),(14,1,2,19),
(15,1,1,1),(15,1,2,5),(15,1,3,6),(15,2,1,12),(15,2,2,9),(15,2,3,8),(15,3,1,14),(15,3,2,13),(15,3,3,11),(15,3,4,20);

-- recommend_menu_tbl (일정마다 1~2개 메뉴 연결)
-- tsche_no 1번부터 순서대로 INSERT (tplan_no 1 → tsche_no 1,2,3 / tplan_no 2 → 4,5,6,7 ...)
INSERT INTO recommend_menu_tbl (tsche_no, menu_no) VALUES
(1,1),(1,2),
(2,49),(2,50),
(3,21),(3,22),
(4,7),(4,8),
(5,53),(5,54),
(6,29),(6,30),
(7,41),
(8,57),(8,58),
(9,43),(9,44),
(10,1),
(11,17),(11,19),
(12,62),(12,64),
(13,45),(13,47),
(14,33),(14,34),
(15,9),(15,10),
(16,61),(16,62),
(17,13),(17,14),
(18,35),(18,36),
(19,45),(19,47),
(20,37),(20,38),
(21,53),(21,55),
(22,45),(22,47),
(23,9),(23,11),
(24,1),(24,3),
(25,33),(25,35),
(26,21),(26,23),
(27,53),(27,54),
(28,33),(28,34),
(29,29),(29,30),
(30,45),(30,46),
(31,69),(31,70),
(32,13),(32,14),
(33,41),(33,42),
(34,21),(34,24),
(35,77),(35,78),
(36,45),(36,47),
(37,53),(37,55),
(38,33),(38,35),
(39,45),(39,46),
(40,73),(40,74),
(41,1),(41,3),
(42,49),(42,51),
(43,21),(43,23);

-- travel_route_tbl
INSERT INTO travel_route_tbl (from_tsche_no, to_tsche_no, transit_type) VALUES
(1,2,'CAR'),(2,3,'WALK'),
(4,5,'WALK'),(5,6,'PUB'),(6,7,'WALK'),
(8,9,'WALK'),(9,10,'CAR'),
(11,12,'PUB'),(12,13,'WALK'),(13,14,'CAR'),(14,15,'WALK'),
(16,17,'WALK'),(17,18,'PUB'),
(19,20,'CAR'),(20,21,'WALK'),(21,22,'PUB'),
(23,24,'WALK'),(24,25,'CAR'),
(26,27,'PUB'),(27,28,'WALK'),
(29,30,'CAR'),(30,31,'WALK'),(31,32,'PUB'),
(33,34,'WALK'),(34,35,'CAR'),
(36,37,'PUB'),(37,38,'WALK'),(38,39,'CAR'),
(40,41,'WALK'),(41,42,'PUB'),
(43,44,'WALK');

-- favorite_plan_tbl (30건)
INSERT INTO favorite_plan_tbl (member_no, tplan_no, created_at) VALUES
(1,4,'2025-02-02 10:00:00'),(1,5,'2025-02-06 11:00:00'),(1,7,'2025-02-16 12:00:00'),
(1,9,'2025-03-02 13:00:00'),(1,10,'2025-03-06 14:00:00'),(1,11,'2025-03-11 15:00:00'),
(1,15,'2025-04-02 16:00:00'),
(2,1,'2025-01-11 10:00:00'),(2,2,'2025-01-16 11:00:00'),(2,3,'2025-01-21 12:00:00'),
(2,7,'2025-02-16 13:00:00'),(2,8,'2025-02-21 14:00:00'),(2,9,'2025-03-02 15:00:00'),
(2,15,'2025-04-02 16:00:00'),(2,12,'2025-03-16 17:00:00'),
(3,1,'2025-01-11 10:00:00'),(3,4,'2025-02-02 11:00:00'),(3,5,'2025-02-06 12:00:00'),
(3,6,'2025-02-11 13:00:00'),(3,10,'2025-03-06 14:00:00'),(3,13,'2025-03-21 15:00:00'),
(3,14,'2025-03-26 16:00:00'),(3,15,'2025-04-02 17:00:00'),
(4,2,'2025-01-16 10:00:00'),(4,3,'2025-01-21 11:00:00'),(4,7,'2025-02-16 12:00:00'),
(4,8,'2025-02-21 13:00:00'),(4,9,'2025-03-02 14:00:00'),(4,13,'2025-03-21 15:00:00'),
(4,15,'2025-04-02 16:00:00');

SET FOREIGN_KEY_CHECKS = 1;

