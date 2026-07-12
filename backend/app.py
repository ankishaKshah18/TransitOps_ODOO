from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models import db


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    JWTManager(app)

    # Create all database tables
    with app.app_context():
        db.create_all()
        print("Database tables created successfully.")

    # Health check API
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "success",
            "message": "TransitOps API is running"
        }), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True,use_reloader=False)
