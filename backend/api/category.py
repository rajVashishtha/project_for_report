import os
import time

from sqlalchemy.sql.expression import except_

from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

from app import app, db
from flask import request
from models.category import Category
from sqlalchemy import desc
import boto3, botocore


s3 = boto3.client(
   "s3",
   aws_access_key_id=app.config['S3_KEY'],
   aws_secret_access_key=app.config['S3_SECRET']
)


def category_serialization(categorie):
    try:
        file_path_thumbnail = app.config['S3_LOCATION'] + 'category/' + categorie.photo
    except Exception as e:
        file_path_thumbnail = "no image"

    obj = {"id": categorie.id, "video_count": categorie.video_count, "photo_url": file_path_thumbnail,
           "views": categorie.views, "created_at": categorie.created_at, "updated_at": categorie.updated_at,
           "name": categorie.name}
    return obj


@app.route('/categories', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()
    if categories:
        res = []
        for categorie in categories:
            res.append(category_serialization(categorie))
        return {"data": res}, 200
    else:
        return {"message": "No category available"}, 404


@app.route('/categories/<int:cat_id>', methods=['GET'])
def get_category_by_id(cat_id):
    category = Category.query.filter_by(id=cat_id).first()
    if not category:
        return {'message': 'category with the given id not found'}, 404
    return {"data": category}, 200


@app.route('/categories/trending', methods=['GET'])
def get_trending_categories():
    categories = Category.query.order_by(desc(Category.views)).all()

    if categories:
        res = []
        for categorie in categories:
            res.append(category_serialization(categorie))
        return {"data": res}, 200
    else:
        return {"message": "No category available"}, 404


@app.route('/categories', methods=['POST'])
@jwt_required
def create_new_category():
    name = request.form.get('name', None)
    photo = request.files.get('photo', None)

    if not all(name):
        return {"message": "name is required"}, 404

    if photo:
        photo_name = secure_filename(photo.filename)
        ext = photo_name.rsplit('.', 1)[1].lower()
        photo_name = str(int(time.time())) + "." + ext

        try:
            s3.upload_fileobj(
                photo,
                app.config['S3_BUCKET'],
                'category/' + photo_name,
                ExtraArgs={
                    "ACL": "public-read"
                }
            )

        except Exception as e:
            # This is a catch all exception, edit this part to fit your needs.
            print("Something Happened: ", e)
            return {"message": "Error while uploading to s3"}, 404
        # photo.save(os.path.join(app.config['UPLOAD_FOLDER_CATEGORY'], photo_name))
    else:
        photo_name = None

    check = Category.query.filter_by(name=name).first()
    if check:
        return {"message": "Category name already exist, try a different name"}, 404

    category = Category(name=name, photo=photo_name)
    db.session.add(category)
    db.session.commit()
    return {'data': category_serialization(category)}, 201


@app.route('/categories/<int:cat_id>', methods=['PATCH'])
@jwt_required
def update_category_by_id(cat_id):
    category = Category.query.filter_by(id=cat_id).first()
    if not category:
        return {'message': 'category with the given id not found'}
    name = request.form.get('name', None)
    if name:
        category.name = name
    db.session.add(category)
    db.session.commit()
    return {'data': category_serialization(category)}, 200


@app.route('/categories/<int:cat_id>', methods=['DELETE'])
@jwt_required
def delete_category_by_id(cat_id):
    if Category.query.filter_by(id=cat_id).delete():
        return {'message': 'category deleted successfully'}, 200
    return {'message': 'category with the given id not found or already deleted'}, 404
