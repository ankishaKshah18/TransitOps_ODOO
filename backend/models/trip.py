from datetime import datetime
from models import db


class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)

    trip_code = db.Column(
        db.String(30), unique=True, nullable=False
    )

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id"),
        nullable=False
    )

    driver_id = db.Column(
        db.Integer,
        db.ForeignKey("drivers.id"),
        nullable=False
    )

    source = db.Column(db.String(150), nullable=False)
    destination = db.Column(db.String(150), nullable=False)

    cargo_weight = db.Column(
        db.Float, nullable=False
    )

    planned_distance = db.Column(
        db.Float, nullable=False
    )

    start_time = db.Column(
        db.DateTime, nullable=True
    )

    end_time = db.Column(
        db.DateTime, nullable=True
    )

    status = db.Column(
        db.String(30),
        default="Draft",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    vehicle = db.relationship("Vehicle", backref="trips")
    driver = db.relationship("Driver", backref="trips")

    def __repr__(self):
        return f"<Trip {self.trip_code}>"