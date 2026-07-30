import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "traffic_secret_key")

    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://root:Rohan%40123@localhost/traffic_management"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False