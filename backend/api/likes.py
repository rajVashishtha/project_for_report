from app import app, db
from flask import request
from models.likes import Like


@app.route('/likes', methods=['POST'])
def like_video():
    video_id = request.form.get('video_id', None)
    like = request.form.get('like', None)
    dislike = request.form.get('dislike', None)

    if not all(video_id):
        return {"message": "video_id is required"}, 404

    ratings = Like.query.filter_by(video_id=video_id).first()
    if ratings:
        if like:
            ratings.likes = ratings.likes + 1
        if dislike:
            ratings.dislikes = ratings.dislikes + 1
        db.session.add(ratings)
        db.session.commit()
        return {"message": "OK"}, 200

    if like:
        ratings = Like(video_id=video_id, likes=1)
        db.session.add(ratings)
        db.session.commit()
        return {"message": "Liked successfully"}, 200

    if dislike:
        ratings = Like(video_id=video_id, dislikes=1)
        db.session.add(ratings)
        db.session.commit()
        return {"message": "dislikes successfully"}, 200
