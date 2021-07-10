from app import db
from datetime import datetime


class VideoAndTag(db.Model):
    __tablename__ = "videoandtag"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), index=True, nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'), index=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

