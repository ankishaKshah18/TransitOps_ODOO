from datetime import datetime
from models import db


class FuelLog(db.Model):
    __tablename__ = "fuel_logs"

    id = db.Column(db.Integer, primary_key=True)

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id"),
        nullable=False
    )

    trip_id = db.Column(
        db.Integer,
        db.ForeignKey("trips.id"),
        nullable=True
    )

    fuel_station = db.Column(
        db.String(150), nullable=True
    )

    litres = db.Column(db.Float, nullable=False)

    price_per_litre = db.Column(
        db.Float, nullable=False
    )

    total_cost = db.Column(
        db.Float, nullable=False
    )

    odometer_reading = db.Column(
        db.Float, nullable=False
    )

    fuel_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    vehicle = db.relationship("Vehicle", backref="fuel_logs")
    trip = db.relationship("Trip", backref="fuel_logs")

    def __repr__(self):
        return f"<FuelLog {self.id}>"