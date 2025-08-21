import os
import mysql.connector
from dotenv import load_dotenv
import sys

# .env 파일 로드
load_dotenv()

def setup_mysql():
    """MySQL 데이터베이스와 사용자 생성"""
    # 환경 변수 가져오기
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'githighlight_user')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'githighlight_password')
    DB_NAME = os.getenv('DB_NAME', 'githighlight_db')
    
    print("MySQL 데이터베이스 설정을 시작합니다...")
    
    try:
        # root 계정으로 접속 (MySQL 관리자 계정)
        root_password = input("MySQL root 비밀번호를 입력하세요: ")
        
        # MySQL 서버에 연결
        connection = mysql.connector.connect(
            host=DB_HOST,
            user="root",
            password=root_password
        )
        
        cursor = connection.cursor()
        
        # 데이터베이스 생성 (이미 있으면 skip)
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"데이터베이스 '{DB_NAME}'가 생성되었습니다.")
        
        # 사용자 생성 및 권한 부여
        try:
            cursor.execute(f"CREATE USER '{DB_USER}'@'{DB_HOST}' IDENTIFIED BY '{DB_PASSWORD}'")
        except mysql.connector.Error as err:
            if err.errno == 1396:  # ER_CANNOT_USER (사용자가 이미 존재함)
                print(f"사용자 '{DB_USER}'가 이미 존재합니다. 비밀번호를 업데이트합니다.")
                cursor.execute(f"ALTER USER '{DB_USER}'@'{DB_HOST}' IDENTIFIED BY '{DB_PASSWORD}'")
            else:
                raise
        
        # 권한 부여
        cursor.execute(f"GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{DB_USER}'@'{DB_HOST}'")
        cursor.execute("FLUSH PRIVILEGES")
        
        print(f"사용자 '{DB_USER}'가 생성되었으며 '{DB_NAME}' 데이터베이스에 대한 권한이 부여되었습니다.")
        
        # 연결 종료
        cursor.close()
        connection.close()
        
        print("MySQL 데이터베이스 설정이 완료되었습니다!")
        return True
        
    except mysql.connector.Error as err:
        print(f"MySQL 오류: {err}")
        return False
    except Exception as e:
        print(f"오류 발생: {e}")
        return False

if __name__ == "__main__":
    success = setup_mysql()
    if success:
        print("MySQL 설정이 완료되었습니다. 이제 migrate_data.py를 실행하여 데이터를 마이그레이션하세요.")
        sys.exit(0)
    else:
        print("MySQL 설정 중 오류가 발생했습니다.")
        sys.exit(1)
