from datetime import datetime
from flask import Blueprint, request, jsonify

from models import db
from models.fuel_log import FuelLog
from models.vehicle import Vehicle

fuel_bp = Blueprint("fuel", __name__, url_prefix="/api/fuel")


@fuel_bp.route("", methods=["GET"])
def get_fuel_logs():
    logs = FuelLog.query.all()

    return jsonify([
        {
            "id": log.id,
            "vehicle_id": log.vehicle_id,
            "trip_id": log.trip_id,
            "fuel_station": log.fuel_station,
            "litres": log.litres,
            "price_per_litre": log.price_per_litre,
            "total_cost": log.total_cost,
            "odometer_reading": log.odometer_reading,
            "fuel_date": log.fuel_date.isoformat()
        }
        for log in logs
    ]), 200


@fuel_bp.route("", methods=["POST"])
def create_fuel_log():
    data = request.get_json() or {}

    required = [
        "vehicle_id",
        "litres",
        "price_per_litre",
        "odometer_reading"
    ]

    if not all(data.get(field) is not None for field in required):
        return jsonify({"message": "Required fields are missing"}), 400

    vehicle = db.session.get(Vehicle, data["vehicle_id"])

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    litres = float(data["litres"])
    price = float(data["price_per_litre"])

    log = FuelLog(
        vehicle_id=vehicle.id,
        trip_id=data.get("trip_id"),
        fuel_station=data.get("fuel_station"),
        litres=litres,
        price_per_litre=price,
        total_cost=litres * price,
        odometer_reading=data["odometer_reading"],
        fuel_date=datetime.utcnow()
    )

    if float(data["odometer_reading"]) > vehicle.odometer:
        vehicle.odometer = data["odometer_reading"]

    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Fuel log created successfully"}), 201