import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


class Config:
    # Flask
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "transitops-secret-key"
    )

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:@localhost/transitops"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "transitops-jwt-secret-key"
    )

    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour