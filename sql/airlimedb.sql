create database airlime;
use airlime;
show tables;

CREATE TABLE AIRLIME_MEMBER(
	  ID					VARCHAR(30)		PRIMARY KEY,
	  PWD			  		VARCHAR(50)		NOT NULL,
	  NAME					VARCHAR(10)		NOT NULL,
	  PHONE					CHAR(13)		NOT NULL, 
	  EMAILNAME				VARCHAR(20)		NOT NULL,
	  EMAILDOMAIN			VARCHAR(20)		NOT NULL,    
	  ZIPCODE				CHAR(5),
	  ADDRESS				VARCHAR(80),
	  MDATE					DATETIME
);
desc airlime_member;
select * from airlime_member;

CREATE TABLE airlime_sns_member (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sns_id VARCHAR(100) NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  provider ENUM('naver', 'kakao', 'google') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
select * from airlime_sns_member;

CREATE TABLE airlime_auth_code (
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL
);
select * from airlime_auth_code;

-- 숙박 리뷰
CREATE TABLE accommodation_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,                -- 리뷰 고유 ID
  category ENUM('accommodation') NOT NULL, -- 리뷰 카테고리
  user_count INT NOT NULL,                          -- 인원수
  location VARCHAR(100) NOT NULL,                   -- 지역 (예: 서울특별시)
  sub_location VARCHAR(100) NOT NULL,               -- 시/군/구 (예: 강남구)
  first_date DATE NOT NULL,                         -- 시작 날짜
  last_date DATE NOT NULL,                          -- 마지막 날짜
  type VARCHAR(100),                                -- 숙박 유형 (예: 모텔/호텔, 펜션 등)
  accommodation_name VARCHAR(200),                  -- 숙박업소명
  room_name VARCHAR(200),                           -- 룸 이름
  price INT NOT NULL,                               -- 가격
  comment TEXT NOT NULL,                            -- 후기 내용
  star DECIMAL(2,1) NOT NULL,                       -- 평점 (예: 4.5)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- 작성 시각
);
INSERT INTO accommodation_reviews ( -- 예시
  category,
  user_count,
  location, sub_location,
  first_date, last_date,
  type, accommodation_name,
  room_name, price,
  comment, star
) VALUES (
  'accommodation', 2, '서울특별시', '강남구', '2025-04-01', '2025-04-03', '모텔/호텔',
	'강남 프리미엄 호텔', '디럭스 더블룸',
  180000, '위치도 좋고 방이 깔끔해서 만족스러웠어요!', 4.5);

select * from accommodation_reviews;

-- 테마 리뷰
CREATE TABLE theme_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,                -- 리뷰 고유 ID
  category ENUM('theme') NOT NULL,                  -- 리뷰 카테고리 (theme 고정)
  title VARCHAR(200) NOT NULL,                      -- 공연 제목
  user_count INT NOT NULL,                          -- 인원수
  type VARCHAR(100) NOT NULL,                       -- 공연 유형 (연극, 공연, 뮤지컬 등)
  location VARCHAR(100) NOT NULL,                   -- 지역 (예: 서울특별시)
  sub_location VARCHAR(200) NOT NULL,               -- 공연 장소 (예: 대학로 소극장)
  price INT NOT NULL,                               -- 가격
  star DECIMAL(2,1) NOT NULL,                       -- 평점 (예: 4.5)
  comment TEXT NOT NULL,                            -- 후기 내용
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- 작성 시각 (자동 기록)
);

INSERT INTO theme_reviews (  -- 예시
  category,
  title,
  user_count,
  type,
  location,
  sub_location,
  price,
  star,
  comment
) VALUES (
  'theme',
  '햄릿',
  2,
  '연극',
  '서울특별시',
  '대학로 예술극장',
  80000,
  4.7,
  '배우들의 감정 전달이 뛰어났고, 연출도 참신했어요!'
);
select * from theme_reviews;

/* 예정
-- 숙박 주문
CREATE TABLE accommodation_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(30),
  accommodation_name VARCHAR(200),
  room_name VARCHAR(200),
  user_count INT,
  checkin_date DATE,
  checkout_date DATE,
  price INT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 테마 주문
CREATE TABLE theme_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(30),
  title VARCHAR(200),
  type VARCHAR(100),
  location VARCHAR(100),
  sub_location VARCHAR(100),
  user_count INT,
  price INT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);*/

-- 공연예매 주문 테이블
CREATE TABLE performance_orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(30) NOT NULL,
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  venue VARCHAR(200) NOT NULL,
  total_price INT NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  order_status ENUM('결제완료', '취소') DEFAULT '결제완료',
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES AIRLIME_MEMBER(ID)
);

-- 공연예매 주문 상세 테이블
CREATE TABLE performance_order_details (
  detail_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  seat_id VARCHAR(20) NOT NULL,
  seat_grade VARCHAR(20) NOT NULL,
  seat_price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES performance_orders(order_id)
);

-- 숙박예약 주문 테이블
CREATE TABLE accommodation_orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(30) NOT NULL,
  accommodation_name VARCHAR(200) NOT NULL,
  room_name VARCHAR(200) NOT NULL,
  address VARCHAR(200) NOT NULL,
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  user_count INT NOT NULL,
  total_price INT NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  order_status ENUM('결제완료', '취소') DEFAULT '결제완료',
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES AIRLIME_MEMBER(ID)
);

-- 숙박예약 주문 상세 테이블
CREATE TABLE accommodation_order_details (
  detail_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  room_type VARCHAR(100) NOT NULL,
  room_price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES accommodation_orders(order_id)
);