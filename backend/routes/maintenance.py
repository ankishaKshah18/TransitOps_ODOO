from datetime import date
from flask import Blueprint, request, jsonify

from models import db
from models.maintenance import Maintenance
from models.vehicle import Vehicle

maintenance_bp = Blueprint(
    "maintenance",
    __name__,
    url_prefix="/api/maintenance"
)


@maintenance_bp.route("", methods=["GET"])
def get_maintenance_records():
    records = Maintenance.query.all()

    return jsonify([
        {
            "id": r.id,
            "vehicle_id": r.vehicle_id,
            "maintenance_type": r.maintenance_type,
            "description": r.description,
            "service_center": r.service_center,
            "service_date": r.service_date.isoformat(),
            "next_service_date": (
                r.next_service_date.isoformat()
                if r.next_service_date else None
            ),
            "cost": r.cost,
            "status": r.status
        }
        for r in records
    ]), 200


@maintenance_bp.route("", methods=["POST"])
def create_maintenance():
    data = request.get_json() or {}

    required = [
        "vehicle_id",
        "maintenance_type",
        "service_center",
        "service_date",
        "cost"
    ]

    if not all(data.get(field) is not None for field in required):
        return jsonify({"message": "Required fields are missing"}), 400

    vehicle = db.session.get(Vehicle, data["vehicle_id"])

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    if vehicle.status == "On Trip":
        return jsonify({
            "message": "Vehicle currently assigned to a trip"
        }), 400

    try:
        service_date = date.fromisoformat(data["service_date"])

        next_service_date = None
        if data.get("next_service_date"):
            next_service_date = date.fromisoformat(
                data["next_service_date"]
            )
    except ValueError:
        return jsonify({"message": "Invalid date format"}), 400

    record = Maintenance(
        vehicle_id=vehicle.id,
        maintenance_type=data["maintenance_type"],
        description=data.get("description"),
        service_center=data["service_center"],
        service_date=service_date,
        next_service_date=next_service_date,
        cost=data["cost"],
        status=data.get("status", "Active")
    )

    vehicle.status = "In Shop"

    db.session.add(record)
    db.session.commit()

    return jsonify({"message": "Maintenance record created"}), 201


@maintenance_bp.route("/<int:record_id>/close", methods=["PUT"])
def close_maintenance(record_id):
    record = db.session.get(Maintenance, record_id)

    if not record:
        return jsonify({"message": "Maintenance record not found"}), 404

    record.status = "Completed"

    vehicle = db.session.get(Vehicle, record.vehicle_id)

    if vehicle.status != "Retired":
        vehicle.status = "Available"

    db.session.commit()

    return jsonify({"message": "Maintenance completed"}), 200