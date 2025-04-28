create database noldabam;
use noldabam;
show tables;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS accommodation_order_details;
DROP TABLE IF EXISTS accommodation_orders;
DROP TABLE IF EXISTS performance_order_details;
DROP TABLE IF EXISTS performance_orders;
DROP TABLE IF EXISTS auth_code;
DROP TABLE IF EXISTS sns_member;
DROP TABLE IF EXISTS member;

-- 새로운 테이블 생성
CREATE TABLE member(
  MID INT AUTO_INCREMENT PRIMARY KEY,
  ID VARCHAR(100) NOT NULL,  -- 일반 회원 ID 또는 SNS ID
  PWD VARCHAR(50),           -- 일반 회원만 사용
  NAME VARCHAR(10) NOT NULL,
  PHONE CHAR(13) NOT NULL, 
  EMAILNAME VARCHAR(20) NOT NULL,
  EMAILDOMAIN VARCHAR(20) NOT NULL,
  GRADE VARCHAR(20) NOT NULL,
  PROVIDER ENUM('local', 'naver', 'kakao', 'google') DEFAULT 'local',  -- 로그인 제공자
  MDATE DATETIME,
  UNIQUE KEY unique_id (ID)  -- ID는 유니크해야 함
);

CREATE TABLE auth_code (
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL
);

-- 공연예매 주문 테이블
CREATE TABLE performance_orders (
  order_id VARCHAR(12) PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  user_id VARCHAR(100) NOT NULL,  -- member의 ID 참조
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  venue VARCHAR(200) NOT NULL,
  venue_address VARCHAR(200) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  total_price INT NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  order_status ENUM('결제완료', '취소', '환불') DEFAULT '결제완료',
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES member(ID)
);

-- 공연예매 주문 상세 테이블
CREATE TABLE performance_order_details (
  detail_order_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(12) NOT NULL,
  seat_id VARCHAR(20) NOT NULL,
  seat_grade VARCHAR(20) NOT NULL,
  seat_price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES performance_orders(order_id) ON DELETE CASCADE
);

-- 숙박예약 주문 테이블
CREATE TABLE accommodation_orders (
  order_id VARCHAR(12) NOT NULL,
  user_id VARCHAR(100) NOT NULL,  -- member의 ID 참조
  accommodation_name VARCHAR(200) NOT NULL,
  room_name VARCHAR(200) NOT NULL,
  address VARCHAR(200) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  user_count INT NOT NULL,
  total_price INT NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  order_status VARCHAR(20) DEFAULT '결제완료',
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id),
  FOREIGN KEY (user_id) REFERENCES member(ID)
);

-- 숙박예약 주문 상세 테이블
CREATE TABLE accommodation_order_details (
  detail_order_id INT NOT NULL AUTO_INCREMENT,
  order_id VARCHAR(12) NOT NULL,
  room_id VARCHAR(50) NOT NULL,
  room_capacity INT NOT NULL,
  room_amenities TEXT,
  PRIMARY KEY (detail_order_id),
  FOREIGN KEY (order_id) REFERENCES accommodation_orders(order_id) ON DELETE CASCADE
);

drop table performance_orders;
drop table performance_order_details;

select * from performance_orders;
select * from performance_order_details;

select * from accommodation_orders;
select * from accommodation_order_details;

-- 숙박 예약과 회원 조인 쿼리
SELECT 
    ao.*,
    CASE 
        WHEN m.ID IS NOT NULL THEN m.ID
        WHEN sm.email IS NOT NULL THEN SUBSTRING_INDEX(sm.email, '@', 1)
    END as user_id,
    CASE 
        WHEN m.ID IS NOT NULL THEN m.NAME
        WHEN sm.email IS NOT NULL THEN sm.name
    END as user_name
FROM accommodation_orders ao
LEFT JOIN member m ON ao.user_id = m.ID
LEFT JOIN sns_member sm ON ao.user_id = SUBSTRING_INDEX(sm.email, '@', 1);


-- 공연 예매와 회원 조인 쿼리
SELECT 
    po.*,
    CASE 
        WHEN m.ID IS NOT NULL THEN m.ID
        WHEN sm.email IS NOT NULL THEN SUBSTRING_INDEX(sm.email, '@', 1)
    END as user_id,
    CASE 
        WHEN m.ID IS NOT NULL THEN m.NAME
        WHEN sm.email IS NOT NULL THEN sm.name
    END as user_name
FROM performance_orders po
LEFT JOIN member m ON po.user_id = m.ID
LEFT JOIN sns_member sm ON po.user_id = SUBSTRING_INDEX(sm.email, '@', 1);

-- 관리자 테이블 생성
-- CREATE TABLE admins (
--   admin_id VARCHAR(50) PRIMARY KEY,       -- 관리자 로그인 ID (중복 불가)
--   password VARCHAR(255) NOT NULL,         -- bcrypt 해시된 비밀번호
--   name VARCHAR(100) NOT NULL,             -- 관리자 이름
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 계정 생성 시각
-- );

SHOW CREATE TABLE 확인할 테이블명; -- 테이블 어떤 구조로 만들어졌는지 확인 가능함
-- 아래 형태처럼 볼수 있음 
Table performance_orders
Create Table 'CREATE TABLE `performance_orders` (
              `order_id` varchar(12) NOT NULL,
              `image_url` varchar(255) NOT NULL,
              `user_id` varchar(30) NOT NULL,
              `title` varchar(200) NOT NULL,
              `date` date NOT NULL,
              `venue` varchar(200) NOT NULL,
              `venue_address` varchar(200) NOT NULL,
              `genre` varchar(50) NOT NULL,
              `total_price` int NOT NULL,
              `payment_method` varchar(20) NOT NULL,
              `order_status` enum(''결제완료'',''취소'',''환불'') DEFAULT ''결제완료'',
              `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
              `performance_id` varchar(10) NOT NULL,
              PRIMARY KEY (`order_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'