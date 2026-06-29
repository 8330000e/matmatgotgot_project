SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- 1. 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS matgotdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE matgotdb;

-- 2. 관리자 계정 생성 및 권한 부여
CREATE USER IF NOT EXISTS 'admin00'@'localhost' IDENTIFIED BY '2222';
CREATE USER IF NOT EXISTS 'admin00'@'%' IDENTIFIED BY '2222';
GRANT ALL PRIVILEGES ON *.* TO 'admin00'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'admin00'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE `MEMBER_TBL` (
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
CREATE TABLE `NATIVES_TBL` (
`native_no`       BIGINT       NOT NULL AUTO_INCREMENT,
`member_id`       VARCHAR(20)  NULL,
`region`          VARCHAR(50)  NOT NULL COMMENT '시도 시군구 동면읍',
`native_deadline` DATETIME     NULL COMMENT 'NULL이면 제한 없음',
PRIMARY KEY (`native_no`),
INDEX `idx_member_id` (`member_id`),
CONSTRAINT `fk_natives_member`
FOREIGN KEY (`member_id`)
REFERENCES `MEMBER_TBL` (`member_id`)
ON DELETE SET NULL
ON UPDATE CASCADE
);
CREATE TABLE `LOGIN_LOG_TBL` (
`login_no`      BIGINT           NOT NULL AUTO_INCREMENT,
`member_no`     BIGINT           NULL,
`login_status`  TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0:로그아웃/1:로그인',
`login_time`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`login_no`),
INDEX `idx_member_no` (`member_no`),
CONSTRAINT `fk_login_member`
FOREIGN KEY (`member_no`)
REFERENCES `MEMBER_TBL` (`member_no`)
ON DELETE SET NULL
ON UPDATE CASCADE
);
CREATE TABLE `SOCIAL_LOGIN_TBL` (
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
REFERENCES `MEMBER_TBL` (`member_no`)
ON DELETE SET NULL
ON UPDATE CASCADE
);


-- 맛집 테이블
CREATE TABLE restaurant_tbl (
    rest_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL,
    rest_name VARCHAR(100) NOT NULL,
    rest_addr VARCHAR(255) NOT NULL,
    lat DOUBLE NOT NULL,        -- 위도
    lng DOUBLE NOT NULL,        -- 경도
    category VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    hours VARCHAR(100),
    rating_sum INT NOT NULL DEFAULT 0,
    review_total_count INT NOT NULL DEFAULT 0,
    local_review_count INT NOT NULL DEFAULT 0,
    rest_content TEXT NOT NULL,
    ai_review TEXT,
    rest_status VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    rest_thumb varchar(300),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_same_restaurant 
    UNIQUE (rest_name, rest_addr),

    CONSTRAINT fk_restaurant_writer
    FOREIGN KEY (member_id) REFERENCES member_tbl(member_id) ON DELETE CASCADE
);
-- 맛집 신고 테이블
CREATE TABLE rest_report_tbl (
    rest_rp_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL,
    rest_no BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('허위정보', '욕설비방', '광고스팸', '기타')),
    detail TEXT,
    report_status TINYINT NOT NULL DEFAULT 0 CHECK (report_status IN (0, 1, 2)),
    report_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rest_report_member
        FOREIGN KEY (member_id)
        REFERENCES member_tbl(member_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_report_restaurant
        FOREIGN KEY (rest_no)
        REFERENCES restaurant_tbl(rest_no)
        ON DELETE CASCADE,

    CONSTRAINT uk_report_unique_rest
        UNIQUE (member_id, rest_no)
);
-- 맛집 좋아요(찜) 테이블
CREATE TABLE rest_like_tbl (
    member_id VARCHAR(50) NOT NULL,
    rest_no BIGINT NOT NULL,

    CONSTRAINT pk_like_rest
    PRIMARY KEY (member_id, rest_no),

    CONSTRAINT fk_like_member
    FOREIGN KEY (member_id) REFERENCES member_tbl(member_id) ON DELETE CASCADE,

    CONSTRAINT fk_like_restaurant
    FOREIGN KEY (rest_no) REFERENCES restaurant_tbl(rest_no) ON DELETE CASCADE
);
-- 리뷰 테이블
CREATE TABLE review_tbl (
    review_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL,
    rest_no BIGINT NOT NULL,
    review_content TEXT NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    visit_date DATE NOT NULL,
    is_local_review BOOLEAN NOT NULL DEFAULT FALSE,
    review_status TINYINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_member 
    FOREIGN KEY (member_id) REFERENCES member_tbl(member_id) ON DELETE CASCADE,

    CONSTRAINT fk_review_restaurant
    FOREIGN KEY (rest_no) REFERENCES restaurant_tbl(rest_no) ON DELETE CASCADE
);
-- 리뷰 메뉴 테이블
CREATE TABLE review_menu_tbl (
    review_menu_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    review_no BIGINT NOT NULL,
    menu_name VARCHAR(100) NOT NULL,
    
    CONSTRAINT uk_review_menu
    UNIQUE (review_no, menu_name),

    CONSTRAINT fk_review_menu_review
    FOREIGN KEY (review_no) REFERENCES review_tbl(review_no) ON DELETE CASCADE
);

-- 리뷰 태그 테이블
CREATE TABLE review_tags_tbl(
    review_tags_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    review_no BIGINT NOT NULL,
    tag_name VARCHAR(30) NOT NULL,

    CONSTRAINT uq_review_tag
    UNIQUE (review_no, tag_name),

    CONSTRAINT fk_review_tags_tbl_review
    FOREIGN KEY (review_no) REFERENCES review_tbl(review_no) ON DELETE CASCADE
);
-- 리뷰 다중 사진 테이블
CREATE TABLE review_images_tbl (
    review_image_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    review_no BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,

    CONSTRAINT fk_review_image
    FOREIGN KEY (review_no) REFERENCES review_tbl(review_no) ON DELETE CASCADE
);
-- 리뷰 좋아요 테이블 
CREATE TABLE review_like_tbl(
	review_no BIGINT NOT NULL,
    member_id VARCHAR(50) NOT NULL,
    
    CONSTRAINT pk_like_review
    PRIMARY KEY (review_no, member_id),

    CONSTRAINT fk_review_like_member
    FOREIGN KEY (member_id) REFERENCES member_tbl(member_id) ON DELETE CASCADE,

    CONSTRAINT fk_review_like_review
    FOREIGN KEY (review_no) REFERENCES review_tbl(review_no) ON DELETE CASCADE
);
-- 리뷰 신고 테이블
CREATE TABLE review_report_tbl (
    review_rp_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL,
    review_no BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('허위정보', '욕설비방', '광고스팸', '기타')),
    detail TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    report_status TINYINT NOT NULL DEFAULT 0 CHECK (report_status IN (0, 1, 2)),

    CONSTRAINT fk_review_report_review
        FOREIGN KEY (review_no)
        REFERENCES review_tbl(review_no)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_report_member
        FOREIGN KEY (member_id)
        REFERENCES member_tbl(member_id)
        ON DELETE CASCADE,

    CONSTRAINT uk_review_report
        UNIQUE (member_id, review_no)
);
-- 리뷰 댓글 테이블
CREATE TABLE review_comment_tbl (
    comment_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    review_no BIGINT NOT NULL,
    member_id VARCHAR(50) NOT NULL,
    parent_comment BIGINT,
    depth TINYINT UNSIGNED NOT NULL DEFAULT 0 CHECK (depth IN (0,1)),	-- 0: 댓글 / 1: 대댓글
    content TEXT NOT NULL,
    com_status TINYINT UNSIGNED NOT NULL DEFAULT 0,	-- 0: 정상 / 1: 숨김
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_comment_review
    FOREIGN KEY (review_no) REFERENCES review_tbl(review_no) ON DELETE CASCADE,

    CONSTRAINT fk_review_comment_member
    FOREIGN KEY (member_id) REFERENCES member_tbl(member_id) ON DELETE CASCADE,

    CONSTRAINT fk_review_comment_parent
    FOREIGN KEY (parent_comment) REFERENCES review_comment_tbl(comment_no) ON DELETE CASCADE
);
-- 리뷰 댓글 신고
CREATE TABLE review_comment_report_tbl (
    review_com_rp_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL,
    comment_no BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('허위정보', '욕설비방', '광고스팸', '기타')),
    detail TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    report_status TINYINT NOT NULL DEFAULT 0 CHECK (report_status IN (0, 1, 2)),

    CONSTRAINT fk_report_com_member
        FOREIGN KEY (member_id)
        REFERENCES member_tbl(member_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_report_com_comment
        FOREIGN KEY (comment_no)
        REFERENCES review_comment_tbl(comment_no)
        ON DELETE CASCADE,

    CONSTRAINT uk_report_unique_comment
        UNIQUE (member_id, comment_no)
);

--게시글 장소
CREATE TABLE BOARD_PLACE_TBL (
    PLACE_NO BIGINT NOT NULL AUTO_INCREMENT,
    PLACE_NAME VARCHAR(150) NOT NULL,
    ADDRESS_NAME VARCHAR(260) NOT NULL,
    PLACE_LAT DOUBLE NULL,
    PLACE_LNG DOUBLE NULL,

    PRIMARY KEY (PLACE_NO),

    UNIQUE KEY UQ_PLACE (
        PLACE_NAME,
        ADDRESS_NAME
    )
);

--게시판
CREATE TABLE BOARD_TBL (
    BOARD_NO BIGINT NOT NULL AUTO_INCREMENT,

    MEMBER_NO BIGINT NOT NULL,

    BOARD_CATEGORY INT NOT NULL
        COMMENT '1:여행후기 / 2:자유게시글',

    BOARD_TITLE VARCHAR(150) NOT NULL,

    BOARD_CONTENT MEDIUMTEXT NOT NULL,

    BOARD_THUMB VARCHAR(500) NULL,

    BOARD_DATE DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    BOARD_STATUS TINYINT NOT NULL DEFAULT 1
        COMMENT '0:관리자비공개 / 1:공개 / 2:삭제',

    PLACE_NO BIGINT NOT NULL,
    
    BOARD_VIEW BIGINT NOT  NULL DEFAULT 0,
    PRIMARY KEY (BOARD_NO),

    CONSTRAINT FK_BOARD_MEMBER
    FOREIGN KEY (MEMBER_NO)
    REFERENCES MEMBER_TBL(MEMBER_NO)
    ON DELETE CASCADE,

    CONSTRAINT FK_BOARD_PLACE
    FOREIGN KEY (PLACE_NO)
    REFERENCES BOARD_PLACE_TBL(PLACE_NO)
    ON DELETE CASCADE
);
--게시글 좋아요
CREATE TABLE BOARD_LIKE_TBL
(
    MEMBER_NO BIGINT NOT NULL,
    BOARD_NO  BIGINT NOT NULL,

    PRIMARY KEY (MEMBER_NO, BOARD_NO),

    CONSTRAINT FK_BOARD_LIKE_MEMBER
    FOREIGN KEY (MEMBER_NO)
    REFERENCES MEMBER_TBL(MEMBER_NO)
    ON DELETE CASCADE,

    CONSTRAINT FK_BOARD_LIKE_BOARD
    FOREIGN KEY (BOARD_NO)
    REFERENCES BOARD_TBL(BOARD_NO)
    ON DELETE CASCADE
);
-- 게시글 댓글 
CREATE TABLE BOARD_COMMENT_TBL
(
    BOARD_COMMENT_NO BIGINT NOT NULL AUTO_INCREMENT,

    BOARD_COMMENT_CONTENT VARCHAR(4000) NOT NULL,

    BOARD_COMMENT_DATE DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    MEMBER_NO BIGINT NOT NULL,

    BOARD_COMMENT_STATUS TINYINT NOT NULL DEFAULT 1
        COMMENT '0:관리자비공개 / 1:공개 / 2:삭제',

    BOARD_NO BIGINT NOT NULL,

    PRIMARY KEY (BOARD_COMMENT_NO),

    CONSTRAINT FK_COMMENT_MEMBER
    FOREIGN KEY (MEMBER_NO)
    REFERENCES MEMBER_TBL(MEMBER_NO)
    ON DELETE CASCADE,

    CONSTRAINT FK_COMMENT_BOARD
    FOREIGN KEY (BOARD_NO)
    REFERENCES BOARD_TBL(BOARD_NO)
    ON DELETE CASCADE
);
-- 게시글 신고
CREATE TABLE BOARD_REPORT_TBL
(
    BOARD_REPORT_NO BIGINT NOT NULL AUTO_INCREMENT,

    MEMBER_NO BIGINT NOT NULL,

    BOARD_NO BIGINT NOT NULL,

    REPORT_REASON VARCHAR(100) NOT NULL
        COMMENT '허위정보, 욕설비방, 광고스팸, 기타',

    REPORT_STATUS TINYINT NOT NULL DEFAULT 0
        COMMENT '0:처리대기, 1:처리완료, 2:반려',

    DETAIL TEXT NULL,

    REPORT_DATE DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (BOARD_REPORT_NO),

    CONSTRAINT FK_REPORT_MEMBER
    FOREIGN KEY (MEMBER_NO)
    REFERENCES MEMBER_TBL(MEMBER_NO)
    ON DELETE CASCADE,

    CONSTRAINT FK_REPORT_BOARD
    FOREIGN KEY (BOARD_NO)
    REFERENCES BOARD_TBL(BOARD_NO)
    ON DELETE CASCADE
);
-- 게시글 댓글 신고
CREATE TABLE BOARD_COMMENT_REPORT_TBL
(
    COMMENT_REPORT_NO BIGINT NOT NULL AUTO_INCREMENT,

    MEMBER_NO BIGINT NOT NULL,

    BOARD_COMMENT_NO BIGINT NOT NULL,

    REPORT_REASON VARCHAR(100) NOT NULL
        COMMENT '허위정보, 욕설비방, 광고스팸, 기타',

    REPORT_STATUS TINYINT NOT NULL DEFAULT 0
        COMMENT '0:처리대기, 1:처리완료, 2:반려',

    DETAIL TEXT NULL,

    REPORT_DATE DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (COMMENT_REPORT_NO),

    CONSTRAINT FK_COMMENT_REPORT_MEMBER
    FOREIGN KEY (MEMBER_NO)
    REFERENCES MEMBER_TBL(MEMBER_NO)
    ON DELETE CASCADE,

    CONSTRAINT FK_COMMENT_REPORT_COMMENT
    FOREIGN KEY (BOARD_COMMENT_NO)
    REFERENCES BOARD_COMMENT_TBL(BOARD_COMMENT_NO)
    ON DELETE CASCADE
);
CREATE TABLE TAG_TBL (
    tag_no INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE MENU_TBL (
    MENU_NO BIGINT NOT NULL AUTO_INCREMENT,
    REST_NO BIGINT NOT NULL,
    MENU_NAME VARCHAR(1000) NOT NULL,
    MENU_PRICE INT NOT NULL,
    MENU_IMG VARCHAR(3000) NOT NULL,

    PRIMARY KEY (MENU_NO),

    CONSTRAINT FK_MENU_RESTAURANT
        FOREIGN KEY (rest_no)
        REFERENCES RESTAURANT_TBL (rest_no)
        ON DELETE CASCADE
);

CREATE TABLE TRAVEL_PLAN_TBL (
    tplan_no BIGINT NOT NULL AUTO_INCREMENT COMMENT '여행계획번호',

    member_no BIGINT NOT NULL COMMENT '작성자',

    tplan_title VARCHAR(230) NOT NULL COMMENT '제목',
    tplan_desc VARCHAR(1000) NULL COMMENT '설명',
    tplan_region VARCHAR(100) NULL COMMENT '지역',

    tplan_days INT NOT NULL DEFAULT 1 COMMENT '여행일수',

    tplan_status TINYINT NOT NULL DEFAULT 1 COMMENT '0:비공개 1:공개',

    tplan_total_price INT NOT NULL DEFAULT 0 COMMENT '총 예상비용',

    tplan_view INT NOT NULL DEFAULT 0 COMMENT '조회수',
    tplan_like INT NOT NULL DEFAULT 0 COMMENT '좋아요수',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (tplan_no),

    CONSTRAINT FK_TRAVEL_PLAN_MEMBER
        FOREIGN KEY (member_no)
        REFERENCES MEMBER_TBL (member_no)
        ON DELETE CASCADE
);

CREATE TABLE PLAN_TAG_TBL (
    tplan_no BIGINT NOT NULL,
    tag_no INT NOT NULL,

    PRIMARY KEY (tplan_no, tag_no),

    CONSTRAINT FK_PLAN_TAG_PLAN
        FOREIGN KEY (tplan_no)
        REFERENCES TRAVEL_PLAN_TBL (tplan_no)
        ON DELETE CASCADE,

    CONSTRAINT FK_PLAN_TAG_TAG
        FOREIGN KEY (tag_no)
        REFERENCES TAG_TBL (tag_no)
        ON DELETE CASCADE
);

CREATE TABLE TRAVEL_SCHEDULE_TBL (
    tsche_no BIGINT NOT NULL AUTO_INCREMENT COMMENT '여행일정번호',

    tplan_no BIGINT NOT NULL COMMENT '여행계획번호',

    tsche_day_no INT NOT NULL COMMENT '몇일차',
    tsche_order_no INT NOT NULL COMMENT '순서',

    rest_no BIGINT NOT NULL COMMENT '맛집번호',

    PRIMARY KEY (tsche_no),

    CONSTRAINT FK_SCHEDULE_PLAN
        FOREIGN KEY (tplan_no)
        REFERENCES TRAVEL_PLAN_TBL (tplan_no)
        ON DELETE CASCADE,

    CONSTRAINT FK_SCHEDULE_RESTAURANT
        FOREIGN KEY (rest_no)
        REFERENCES RESTAURANT_TBL (rest_no)
        ON DELETE CASCADE
);

CREATE TABLE RECOMMEND_MENU_TBL (
    tsche_no BIGINT NOT NULL,
    menu_no BIGINT NOT NULL,

    PRIMARY KEY (tsche_no, menu_no),

    CONSTRAINT FK_RECOMMEND_MENU_SCHEDULE
        FOREIGN KEY (tsche_no)
        REFERENCES TRAVEL_SCHEDULE_TBL (tsche_no)
        ON DELETE CASCADE,

    CONSTRAINT FK_RECOMMEND_MENU_MENU
        FOREIGN KEY (menu_no)
        REFERENCES MENU_TBL (menu_no)
        ON DELETE CASCADE
);

CREATE TABLE TRAVEL_ROUTE_TBL (
    troute_no BIGINT NOT NULL AUTO_INCREMENT COMMENT '이동정보번호',

    from_tsche_no BIGINT NOT NULL COMMENT '출발 일정번호',
    to_tsche_no BIGINT NOT NULL COMMENT '도착 일정번호',

    transit_type VARCHAR(10) NOT NULL COMMENT 'WALK, PUB, CAR',

    PRIMARY KEY (troute_no),

    CONSTRAINT FK_ROUTE_FROM
        FOREIGN KEY (from_tsche_no)
        REFERENCES TRAVEL_SCHEDULE_TBL (tsche_no)
        ON DELETE CASCADE,

    CONSTRAINT FK_ROUTE_TO
        FOREIGN KEY (to_tsche_no)
        REFERENCES TRAVEL_SCHEDULE_TBL (tsche_no)
        ON DELETE CASCADE,

    CONSTRAINT CHK_TRANSIT_TYPE
        CHECK (transit_type IN ('WALK', 'PUB', 'CAR'))
);

CREATE TABLE FAVORITE_PLAN_TBL (
    member_no BIGINT NOT NULL COMMENT '회원번호',
    tplan_no BIGINT NOT NULL COMMENT '여행계획번호',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '찜한일시',

    PRIMARY KEY (member_no, tplan_no),

    CONSTRAINT FK_FAVORITE_MEMBER
        FOREIGN KEY (member_no)
        REFERENCES MEMBER_TBL (member_no)
        ON DELETE CASCADE,

    CONSTRAINT FK_FAVORITE_PLAN
        FOREIGN KEY (tplan_no)
        REFERENCES TRAVEL_PLAN_TBL (tplan_no)
        ON DELETE CASCADE
);

INSERT INTO RESTAURANT_TBL 
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

INSERT INTO TAG_TBL (tag_name) VALUES
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

INSERT INTO MENU_TBL (REST_NO, MENU_NAME, MENU_PRICE, MENU_IMG) VALUES
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

INSERT INTO REST_LIKE_TBL (member_id, rest_no) VALUES
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