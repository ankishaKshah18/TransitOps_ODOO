from datetime import date
from flask import Blueprint, request, jsonify

from models import db
from models.driver import Driver

drivers_bp = Blueprint(
    "drivers",
    __name__,
    url_prefix="/api/drivers"
)


def driver_to_dict(driver):
    return {
        "id": driver.id,
        "employee_id": driver.employee_id,
        "name": driver.name,
        "email": driver.email,
        "phone": driver.phone,
        "license_number": driver.license_number,
        "license_category": driver.license_category,
        "license_expiry_date": (
            driver.license_expiry_date.isoformat()
            if driver.license_expiry_date else None
        ),
        "experience_years": driver.experience_years,
        "safety_score": driver.safety_score,
        "status": driver.status
    }


@drivers_bp.route("", methods=["GET"])
def get_drivers():
    drivers = Driver.query.all()
    return jsonify([driver_to_dict(d) for d in drivers]), 200


@drivers_bp.route("/available", methods=["GET"])
def get_available_drivers():
    drivers = Driver.query.filter(
        Driver.status == "Available",
        Driver.license_expiry_date >= date.today()
    ).all()

    return jsonify([driver_to_dict(d) for d in drivers]), 200


@drivers_bp.route("", methods=["POST"])
def create_driver():
    data = request.get_json() or {}

    required = [
        "employee_id",
        "name",
        "email",
        "phone",
        "license_number",
        "license_category",
        "license_expiry_date"
    ]

    if not all(data.get(field) for field in required):
        return jsonify({"message": "Required fields are missing"}), 400

    if Driver.query.filter_by(
        employee_id=data["employee_id"]
    ).first():
        return jsonify({"message": "Employee ID already exists"}), 409

    if Driver.query.filter_by(
        license_number=data["license_number"]
    ).first():
        return jsonify({"message": "License number already exists"}), 409

    try:
        expiry = date.fromisoformat(data["license_expiry_date"])
    except ValueError:
        return jsonify({
            "message": "license_expiry_date must be YYYY-MM-DD"
        }), 400

    driver = Driver(
        employee_id=data["employee_id"],
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        license_number=data["license_number"],
        license_category=data["license_category"],
        license_expiry_date=expiry,
        experience_years=data.get("experience_years", 0),
        safety_score=data.get("safety_score", 100),
        status=data.get("status", "Available")
    )

    db.session.add(driver)
    db.session.commit()

    return jsonify({
        "message": "Driver created successfully",
        "driver": driver_to_dict(driver)
    }), 201


@drivers_bp.route("/<int:driver_id>", methods=["PUT"])
def update_driver(driver_id):
    driver = db.session.get(Driver, driver_id)

    if not driver:
        return jsonify({"message": "Driver not found"}), 404

    data = request.get_json() or {}

    if "license_expiry_date" in data:
        try:
            driver.license_expiry_date = date.fromisoformat(
                data["license_expiry_date"]
            )
        except ValueError:
            return jsonify({"message": "Invalid date format"}), 400

    fields = [
        "employee_id",
        "name",
        "email",
        "phone",
        "license_number",
        "license_category",
        "experience_years",
        "safety_score",
        "status"
    ]

    for field in fields:
        if field in data:
            setattr(driver, field, data[field])

    db.session.commit()

    return jsonify({
        "message": "Driver updated successfully",
        "driver": driver_to_dict(driver)
    }), 200


@drivers_bp.route("/<int:driver_id>", methods=["DELETE"])
def delete_driver(driver_id):
    driver = db.session.get(Driver, driver_id)

    if not driver:
        return jsonify({"message": "Driver not found"}), 404

    db.session.delete(driver)
    db.session.commit()

    return jsonify({"message": "Driver deleted successfully"}), 200