from datetime import datetime
from models import db


class Driver(db.Model):
    __tablename__ = "drivers"

    id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(
        db.String(20), unique=True, nullable=False
    )

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(
        db.String(120), unique=True, nullable=False
    )

    phone = db.Column(db.String(15), nullable=False)

    license_number = db.Column(
        db.String(50), unique=True, nullable=False
    )

    license_category = db.Column(
        db.String(50), nullable=False
    )

    license_expiry_date = db.Column(
        db.Date, nullable=False
    )

    experience_years = db.Column(
        db.Integer, default=0
    )

    safety_score = db.Column(
        db.Float, default=100
    )

    status = db.Column(
        db.String(20),
        default="Available",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def __repr__(self):
        return f"<Driver {self.name}>"