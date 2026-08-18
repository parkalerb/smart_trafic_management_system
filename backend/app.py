import os
from flask import Flask
from flask_cors import CORS

from config import Config
from database.db import db
from routes import register_routes
from models import TrafficSignal

app = Flask(__name__)

app.config.from_object(Config)

is_production = os.getenv("FLASK_ENV") == "production"
cors_origins_env = os.getenv("CORS_ORIGINS")

# CORS configuration logic:
# In production mode, require explicitly set CORS_ORIGINS to prevent wildcard exposure
if is_production:
    if not cors_origins_env:
        raise ValueError(
            "CRITICAL CONFIGURATION ERROR: CORS_ORIGINS environment variable must be set in production mode."
        )
    origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
    CORS(app, origins=origins)
else:
    if cors_origins_env:
        origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
        CORS(app, origins=origins)
    else:
        CORS(app)

db.init_app(app)

register_routes(app)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=not is_production)