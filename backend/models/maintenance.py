from datetime import datetime
from models import db


class Maintenance(db.Model):
    __tablename__ = "maintenance"

    id = db.Column(db.Integer, primary_key=True)

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id"),
        nullable=False
    )

    maintenance_type = db.Column(
        db.String(100), nullable=False
    )

    description = db.Column(db.Text, nullable=True)

    service_center = db.Column(
        db.String(150), nullable=False
    )

    service_date = db.Column(
        db.Date, nullable=False
    )

    next_service_date = db.Column(
        db.Date, nullable=True
    )

    cost = db.Column(
        db.Float, nullable=False, default=0
    )

    status = db.Column(
        db.String(30),
        default="Active",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    vehicle = db.relationship(
        "Vehicle",
        backref="maintenance_records"
    )

    def __repr__(self):
        return f"<Maintenance {self.id}>"