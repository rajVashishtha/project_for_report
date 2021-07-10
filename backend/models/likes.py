from app import db
from datetime import datetime


class Like(db.Model):
    __tablename__ = "likes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    video_id = db.Column(db.Integer, nullable=False)
    likes = db.Column(db.BigInteger, default=0, nullable=False)
    dislikes = db.Column(db.BigInteger, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
