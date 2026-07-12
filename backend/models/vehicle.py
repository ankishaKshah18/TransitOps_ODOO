from datetime import datetime

from models import db


class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    vehicle_number = db.Column(
        db.String(30),
        unique=True,
        nullable=False
    )

    vehicle_type = db.Column(
        db.String(50),
        nullable=False
    )

    manufacturer = db.Column(
        db.String(100),
        nullable=False
    )

    model = db.Column(
        db.String(100),
        nullable=False
    )

    manufacturing_year = db.Column(
        db.Integer,
        nullable=False
    )

    fuel_type = db.Column(
        db.String(30),
        nullable=False
    )

    seating_capacity = db.Column(
        db.Integer,
        nullable=False
    )

    odometer = db.Column(
        db.Float,
        default=0
    )

    status = db.Column(
        db.String(30),
        default="Available"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def __repr__(self):
        return f"<Vehicle {self.vehicle_number}>"