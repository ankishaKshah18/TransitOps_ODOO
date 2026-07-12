from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models import db

from routes.auth import auth_bp
from routes.vehicles import vehicles_bp
from routes.drivers import drivers_bp
from routes.trips import trips_bp
from routes.maintenance import maintenance_bp
from routes.fuel import fuel_bp
from routes.expenses import expenses_bp
from routes.dashboard import dashboard_bp
from routes.reports import reports_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(vehicles_bp)
    app.register_blueprint(drivers_bp)
    app.register_blueprint(trips_bp)
    app.register_blueprint(maintenance_bp)
    app.register_blueprint(fuel_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(reports_bp)

    with app.app_context():
        db.create_all()
        print("Database tables created successfully.")

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "success",
            "message": "TransitOps API is running"
        }), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)