from app import db
from datetime import datetime


class Video(db.Model):
    __tablename__ = "video"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True)
    admin_id = db.Column(db.Integer, nullable=True)
    category_id = db.Column(db.Integer, nullable=True)

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1024), nullable=True)
    name = db.Column(db.String(255), nullable=False)
    thumbnail = db.Column(db.String(255), nullable=False)
    views = db.Column(db.BigInteger, default=0, nullable=False)
    duration = db.Column(db.String(128), nullable=True)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
