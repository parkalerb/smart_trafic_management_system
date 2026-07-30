from flask import Flask
from flask_cors import CORS

from config import Config
from database.db import db
from routes import register_routes
from models import TrafficSignal
app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)

register_routes(app)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)