from datetime import date
from flask import Blueprint, request, jsonify

from models import db
from models.expense import Expense
from models.vehicle import Vehicle

expenses_bp = Blueprint(
    "expenses",
    __name__,
    url_prefix="/api/expenses"
)


@expenses_bp.route("", methods=["GET"])
def get_expenses():
    expenses = Expense.query.all()

    return jsonify([
        {
            "id": e.id,
            "vehicle_id": e.vehicle_id,
            "trip_id": e.trip_id,
            "category": e.category,
            "description": e.description,
            "amount": e.amount,
            "expense_date": e.expense_date.isoformat()
        }
        for e in expenses
    ]), 200


@expenses_bp.route("", methods=["POST"])
def create_expense():
    data = request.get_json() or {}

    required = [
        "vehicle_id",
        "category",
        "amount",
        "expense_date"
    ]

    if not all(data.get(field) is not None for field in required):
        return jsonify({"message": "Required fields are missing"}), 400

    vehicle = db.session.get(Vehicle, data["vehicle_id"])

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    try:
        expense_date = date.fromisoformat(data["expense_date"])
    except ValueError:
        return jsonify({"message": "Invalid date format"}), 400

    expense = Expense(
        vehicle_id=vehicle.id,
        trip_id=data.get("trip_id"),
        category=data["category"],
        description=data.get("description"),
        amount=data["amount"],
        expense_date=expense_date
    )

    db.session.add(expense)
    db.session.commit()

    return jsonify({"message": "Expense created successfully"}), 201