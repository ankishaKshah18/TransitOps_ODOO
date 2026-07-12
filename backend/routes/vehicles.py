from flask import Blueprint, request, jsonify

from models import db
from models.vehicle import Vehicle

vehicles_bp = Blueprint(
    "vehicles",
    __name__,
    url_prefix="/api/vehicles"
)


def vehicle_to_dict(vehicle):
    return {
        "id": vehicle.id,
        "registration_number": vehicle.registration_number,
        "name": vehicle.name,
        "vehicle_type": vehicle.vehicle_type,
        "manufacturer": vehicle.manufacturer,
        "model": vehicle.model,
        "manufacturing_year": vehicle.manufacturing_year,
        "fuel_type": vehicle.fuel_type,
        "max_load_capacity": vehicle.max_load_capacity,
        "seating_capacity": vehicle.seating_capacity,
        "odometer": vehicle.odometer,
        "acquisition_cost": vehicle.acquisition_cost,
        "status": vehicle.status
    }


@vehicles_bp.route("", methods=["GET"])
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([vehicle_to_dict(v) for v in vehicles]), 200


@vehicles_bp.route("/<int:vehicle_id>", methods=["GET"])
def get_vehicle(vehicle_id):
    vehicle = db.session.get(Vehicle, vehicle_id)

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    return jsonify(vehicle_to_dict(vehicle)), 200


@vehicles_bp.route("/available", methods=["GET"])
def get_available_vehicles():
    vehicles = Vehicle.query.filter_by(status="Available").all()
    return jsonify([vehicle_to_dict(v) for v in vehicles]), 200


@vehicles_bp.route("", methods=["POST"])
def create_vehicle():
    data = request.get_json() or {}

    required = [
        "registration_number",
        "name",
        "vehicle_type",
        "max_load_capacity"
    ]

    if not all(data.get(field) is not None for field in required):
        return jsonify({"message": "Required fields are missing"}), 400

    existing = Vehicle.query.filter_by(
        registration_number=data["registration_number"]
    ).first()

    if existing:
        return jsonify({
            "message": "Registration number already exists"
        }), 409

    vehicle = Vehicle(
        registration_number=data["registration_number"],
        name=data["name"],
        vehicle_type=data["vehicle_type"],
        manufacturer=data.get("manufacturer"),
        model=data.get("model"),
        manufacturing_year=data.get("manufacturing_year"),
        fuel_type=data.get("fuel_type"),
        max_load_capacity=data["max_load_capacity"],
        seating_capacity=data.get("seating_capacity"),
        odometer=data.get("odometer", 0),
        acquisition_cost=data.get("acquisition_cost", 0),
        status=data.get("status", "Available")
    )

    db.session.add(vehicle)
    db.session.commit()

    return jsonify({
        "message": "Vehicle created successfully",
        "vehicle": vehicle_to_dict(vehicle)
    }), 201


@vehicles_bp.route("/<int:vehicle_id>", methods=["PUT"])
def update_vehicle(vehicle_id):
    vehicle = db.session.get(Vehicle, vehicle_id)

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    data = request.get_json() or {}

    if "registration_number" in data:
        duplicate = Vehicle.query.filter(
            Vehicle.registration_number == data["registration_number"],
            Vehicle.id != vehicle_id
        ).first()

        if duplicate:
            return jsonify({
                "message": "Registration number already exists"
            }), 409

    fields = [
        "registration_number",
        "name",
        "vehicle_type",
        "manufacturer",
        "model",
        "manufacturing_year",
        "fuel_type",
        "max_load_capacity",
        "seating_capacity",
        "odometer",
        "acquisition_cost",
        "status"
    ]

    for field in fields:
        if field in data:
            setattr(vehicle, field, data[field])

    db.session.commit()

    return jsonify({
        "message": "Vehicle updated successfully",
        "vehicle": vehicle_to_dict(vehicle)
    }), 200


@vehicles_bp.route("/<int:vehicle_id>", methods=["DELETE"])
def delete_vehicle(vehicle_id):
    vehicle = db.session.get(Vehicle, vehicle_id)

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    db.session.delete(vehicle)
    db.session.commit()

    return jsonify({"message": "Vehicle deleted successfully"}), 200