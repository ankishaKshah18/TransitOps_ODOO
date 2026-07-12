from datetime import datetime
from models import db


class Alert(db.Model):
    __tablename__ = "alerts"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id"),
        nullable=True
    )

    driver_id = db.Column(
        db.Integer,
        db.ForeignKey("drivers.id"),
        nullable=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    alert_type = db.Column(
        db.String(50),
        nullable=False
    )

    severity = db.Column(
        db.String(20),
        default="Medium"
    )

    is_read = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # Relationships
    vehicle = db.relationship("Vehicle", backref="alerts")
    driver = db.relationship("Driver", backref="alerts")

    def __repr__(self):
        return f"<Alert {self.title}>"