from flask import Blueprint, jsonify

from models.vehicle import Vehicle
from models.driver import Driver
from models.trip import Trip


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


@dashboard_bp.route("", methods=["GET"])
def get_dashboard():
    total_vehicles = Vehicle.query.count()
    on_trip = Vehicle.query.filter_by(status="On Trip").count()

    utilization = (
        round((on_trip / total_vehicles) * 100, 2)
        if total_vehicles > 0
        else 0
    )

    return jsonify({
        "total_vehicles": total_vehicles,
        "available_vehicles": Vehicle.query.filter_by(
            status="Available"
        ).count(),
        "vehicles_on_trip": on_trip,
        "vehicles_in_maintenance": Vehicle.query.filter_by(
            status="In Shop"
        ).count(),
        "active_trips": Trip.query.filter_by(
            status="Dispatched"
        ).count(),
        "pending_trips": Trip.query.filter_by(
            status="Draft"
        ).count(),
        "drivers_available": Driver.query.filter_by(
            status="Available"
        ).count(),
        "drivers_on_duty": Driver.query.filter_by(
            status="On Trip"
        ).count(),
        "fleet_utilization": utilization
    }), 200