from app import db
from datetime import datetime


class Tag(db.Model):
    __tablename__ = "tag"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True)
    # video_id = db.Column(db.Integer, db.ForeignKey('video.id'), index=True, nullable=False)
    name = db.Column(db.String(255), unique=True, index=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

