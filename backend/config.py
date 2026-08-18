import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

class Config:
    is_production = os.getenv("FLASK_ENV") == "production"

    secret_key = os.getenv("SECRET_KEY")

    # In production, require explicit SECRET_KEY to prevent weak default sessions
    if is_production and not secret_key:
        raise ValueError(
            "CRITICAL CONFIGURATION ERROR: SECRET_KEY environment variable must be set in production mode."
        )

    # Use environment secret_key if present, fallback to local dev key in development mode only
    SECRET_KEY = secret_key or "dev_local_secret_key_traffic_system"

    # Primary environment DB URI, with fallback to local development database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        os.getenv(
            "MYSQL_DATABASE_URI",
            "mysql+pymysql://root:Rohan%40123@localhost/traffic_management"
        )
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False