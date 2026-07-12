from datetime import datetime, date
from flask import Blueprint, request, jsonify

from models import db
from models.trip import Trip
from models.vehicle import Vehicle
from models.driver import Driver

trips_bp = Blueprint("trips", __name__, url_prefix="/api/trips")


def trip_to_dict(trip):
    return {
        "id": trip.id,
        "trip_code": trip.trip_code,
        "vehicle_id": trip.vehicle_id,
        "driver_id": trip.driver_id,
        "source": trip.source,
        "destination": trip.destination,
        "cargo_weight": trip.cargo_weight,
        "planned_distance": trip.planned_distance,
        "start_time": (
            trip.start_time.isoformat() if trip.start_time else None
        ),
        "end_time": (
            trip.end_time.isoformat() if trip.end_time else None
        ),
        "status": trip.status
    }


@trips_bp.route("", methods=["GET"])
def get_trips():
    return jsonify([
        trip_to_dict(trip)
        for trip in Trip.query.all()
    ]), 200


@trips_bp.route("", methods=["POST"])
def create_trip():
    data = request.get_json() or {}

    required = [
        "trip_code",
        "vehicle_id",
        "driver_id",
        "source",
        "destination",
        "cargo_weight",
        "planned_distance"
    ]

    if not all(data.get(field) is not None for field in required):
        return jsonify({"message": "Required fields are missing"}), 400

    if Trip.query.filter_by(trip_code=data["trip_code"]).first():
        return jsonify({"message": "Trip code already exists"}), 409

    vehicle = db.session.get(Vehicle, data["vehicle_id"])
    driver = db.session.get(Driver, data["driver_id"])

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    if not driver:
        return jsonify({"message": "Driver not found"}), 404

    if vehicle.status != "Available":
        return jsonify({"message": "Vehicle is not available"}), 400

    if driver.status != "Available":
        return jsonify({"message": "Driver is not available"}), 400

    if driver.license_expiry_date < date.today():
        return jsonify({"message": "Driver license has expired"}), 400

    if float(data["cargo_weight"]) > vehicle.max_load_capacity:
        return jsonify({
            "message": "Cargo exceeds vehicle maximum load capacity"
        }), 400

    trip = Trip(
        trip_code=data["trip_code"],
        vehicle_id=vehicle.id,
        driver_id=driver.id,
        source=data["source"],
        destination=data["destination"],
        cargo_weight=data["cargo_weight"],
        planned_distance=data["planned_distance"],
        status="Draft"
    )

    db.session.add(trip)
    db.session.commit()

    return jsonify({
        "message": "Trip created successfully",
        "trip": trip_to_dict(trip)
    }), 201


@trips_bp.route("/<int:trip_id>/dispatch", methods=["PUT"])
def dispatch_trip(trip_id):
    trip = db.session.get(Trip, trip_id)

    if not trip:
        return jsonify({"message": "Trip not found"}), 404

    if trip.status != "Draft":
        return jsonify({
            "message": "Only Draft trips can be dispatched"
        }), 400

    vehicle = db.session.get(Vehicle, trip.vehicle_id)
    driver = db.session.get(Driver, trip.driver_id)

    if vehicle.status != "Available":
        return jsonify({"message": "Vehicle is unavailable"}), 400

    if driver.status != "Available":
        return jsonify({"message": "Driver is unavailable"}), 400

    if driver.license_expiry_date < date.today():
        return jsonify({"message": "Driver license has expired"}), 400

    if trip.cargo_weight > vehicle.max_load_capacity:
        return jsonify({
            "message": "Cargo exceeds vehicle capacity"
        }), 400

    trip.status = "Dispatched"
    trip.start_time = datetime.utcnow()

    vehicle.status = "On Trip"
    driver.status = "On Trip"

    db.session.commit()

    return jsonify({"message": "Trip dispatched successfully"}), 200


@trips_bp.route("/<int:trip_id>/complete", methods=["PUT"])
def complete_trip(trip_id):
    trip = db.session.get(Trip, trip_id)

    if not trip:
        return jsonify({"message": "Trip not found"}), 404

    if trip.status != "Dispatched":
        return jsonify({
            "message": "Only dispatched trips can be completed"
        }), 400

    vehicle = db.session.get(Vehicle, trip.vehicle_id)
    driver = db.session.get(Driver, trip.driver_id)

    data = request.get_json() or {}

    if "final_odometer" in data:
        vehicle.odometer = data["final_odometer"]

    trip.status = "Completed"
    trip.end_time = datetime.utcnow()

    vehicle.status = "Available"
    driver.status = "Available"

    db.session.commit()

    return jsonify({"message": "Trip completed successfully"}), 200


@trips_bp.route("/<int:trip_id>/cancel", methods=["PUT"])
def cancel_trip(trip_id):
    trip = db.session.get(Trip, trip_id)

    if not trip:
        return jsonify({"message": "Trip not found"}), 404

    if trip.status in ["Completed", "Cancelled"]:
        return jsonify({"message": "Trip cannot be cancelled"}), 400

    vehicle = db.session.get(Vehicle, trip.vehicle_id)
    driver = db.session.get(Driver, trip.driver_id)

    if trip.status == "Dispatched":
        if vehicle.status != "Retired":
            vehicle.status = "Available"

        driver.status = "Available"

    trip.status = "Cancelled"

    db.session.commit()

    return jsonify({"message": "Trip cancelled successfully"}), 200