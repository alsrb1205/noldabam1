
import json
import mysql.connector

# MySQL 연결 설정 ()
db = mysql.connector.connect(
    host="project-db.c34cwcu2k1w5.ap-northeast-2.rds.amazonaws.com", # aws rds 배포 주소로 바꿔야 함.
    user="admin",
    password="mysql1234",
    database="noldabam"
)
cursor = db.cursor()

# JSON 파일 불러오기
with open("final_customers.json", "r", encoding="utf-8") as f:
    members = json.load(f)

# 회원 데이터 삽입
for member in members:
    cursor.execute("""
    INSERT INTO member (
        ID, PWD, NAME, PHONE, EMAILNAME, EMAILDOMAIN, GRADE, PROVIDER, MDATE
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, now())
    """, (
        member["ID"],
        member["PWD"],
        member["NAME"],
        member["PHONE"],
        member["EMAILNAME"],
        member["EMAILDOMAIN"],
        member["GRADE"],
        member["PROVIDER"]
    ))

# 커밋 및 종료
db.commit()
cursor.close()
db.close()

print("✅ 회원 데이터 삽입 완료!")
