from flask import Blueprint, jsonify
from sqlalchemy import func

from models import db
from models.fuel_log import FuelLog
from models.expense import Expense
from models.maintenance import Maintenance

reports_bp = Blueprint(
    "reports",
    __name__,
    url_prefix="/api/reports"
)


@reports_bp.route("/summary", methods=["GET"])
def report_summary():
    fuel_cost = db.session.query(
        func.coalesce(func.sum(FuelLog.total_cost), 0)
    ).scalar()

    other_expenses = db.session.query(
        func.coalesce(func.sum(Expense.amount), 0)
    ).scalar()

    maintenance_cost = db.session.query(
        func.coalesce(func.sum(Maintenance.cost), 0)
    ).scalar()

    total = fuel_cost + other_expenses + maintenance_cost

    return jsonify({
        "total_fuel_cost": float(fuel_cost),
        "total_expenses": float(other_expenses),
        "total_maintenance_cost": float(maintenance_cost),
        "total_operational_cost": float(total)
    }), 200