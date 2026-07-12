from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models after db is created
from models.user import User
from models.vehicle import Vehicle
from models.driver import Driver
from models.trip import Trip
from models.fuel_log import FuelLog
from models.maintenance import Maintenance
from models.expense import Expense
from models.alert import Alert