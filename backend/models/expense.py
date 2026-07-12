from datetime import datetime
from models import db


class Expense(db.Model):
    __tablename__ = "expenses"

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

    category = db.Column(
        db.String(100), nullable=False
    )

    description = db.Column(
        db.Text, nullable=True
    )

    amount = db.Column(
        db.Float, nullable=False
    )

    expense_date = db.Column(
        db.Date, nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    vehicle = db.relationship("Vehicle", backref="expenses")
    trip = db.relationship("Trip", backref="expenses")

    def __repr__(self):
        return f"<Expense {self.id}>"