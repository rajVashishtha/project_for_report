from app import db
from datetime import datetime


class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(255), unique=True, nullable=False)
    video_count = db.Column(db.BigInteger, default=0, nullable=False)
    views = db.Column(db.BigInteger, default=0, nullable=False)
    photo = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
