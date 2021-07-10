from app import app, db
from models.tag import Tag
from flask import request


# @app.route('/tags', methods=['GET'])
# def get_all_tags():
#     name = request.args.get('name', None)
#     if name:
#         tags = Tag.query.filter
#     tags = Tag.query.all()
#     return {'data': tags}, 200

