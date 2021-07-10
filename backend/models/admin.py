from app import db
from datetime import datetime


class Admin(db.Model):
    __tablename__ = "admin"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(64), index=True, nullable=False)
    otp = db.Column(db.Integer, default=0, nullable=True)
    verified = db.Column(db.Boolean, default=False, nullable=False)
    type = db.Column(db.Integer, default=0, nullable=False)
    added_by = db.Column(db.String(64), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
