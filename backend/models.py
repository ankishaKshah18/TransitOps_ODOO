from database import db
from datetime import datetime


# Roles table
class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), unique=True, nullable=False)

    users = db.relationship("User", backref="role")


# Users table
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"))

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


# Vehicles table
class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(db.Integer, primary_key=True)

    registration_number = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    vehicle_type = db.Column(db.String(50))
    model = db.Column(db.String(100))

    maximum_capacity = db.Column(
        db.Float,
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="Available"
    )


# Drivers table
class Driver(db.Model):
    __tablename__ = "drivers"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    license_number = db.Column(
        db.String(50),
        unique=True
    )

    license_expiry = db.Column(db.Date)

    status = db.Column(
        db.String(30),
        default="Available"
    )


# Trips table
class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id")
    )

    driver_id = db.Column(
        db.Integer,
        db.ForeignKey("drivers.id")
    )

    source = db.Column(db.String(100))
    destination = db.Column(db.String(100))

    cargo_weight = db.Column(db.Float)

    status = db.Column(
        db.String(30),
        default="Scheduled"
    )

    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)



# Maintenance Logs table
class MaintenanceLog(db.Model):
    __tablename__ = "maintenance_logs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id")
    )

    description = db.Column(db.String(255))

    cost = db.Column(db.Float)

    date = db.Column(db.Date)



# Fuel Logs table
class FuelLog(db.Model):
    __tablename__ = "fuel_logs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id")
    )

    quantity = db.Column(db.Float)

    cost = db.Column(db.Float)

    date = db.Column(db.Date)



# Expenses table
class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id")
    )

    expense_type = db.Column(db.String(50))

    amount = db.Column(db.Float)

    date = db.Column(db.Date)

    description = db.Column(db.String(255))