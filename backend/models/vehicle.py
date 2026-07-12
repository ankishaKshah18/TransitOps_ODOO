from datetime import datetime
from models import db


class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(db.Integer, primary_key=True)

    registration_number = db.Column(
        db.String(30), unique=True, nullable=False
    )

    name = db.Column(db.String(100), nullable=False)
    vehicle_type = db.Column(db.String(50), nullable=False)
    manufacturer = db.Column(db.String(100), nullable=True)
    model = db.Column(db.String(100), nullable=True)
    manufacturing_year = db.Column(db.Integer, nullable=True)
    fuel_type = db.Column(db.String(30), nullable=True)

    max_load_capacity = db.Column(
        db.Float, nullable=False
    )

    seating_capacity = db.Column(
        db.Integer, nullable=True
    )

    odometer = db.Column(
        db.Float, default=0
    )

    acquisition_cost = db.Column(
        db.Float, default=0
    )

    status = db.Column(
        db.String(30),
        default="Available",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def __repr__(self):
        return f"<Vehicle {self.registration_number}>"