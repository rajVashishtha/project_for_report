from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import app, db
from models.category import Category
from models.likes import Like
from models.tag import Tag
from models.video import Video
from models.video_and_tag import VideoAndTag

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def ratings(video_id):
    rating = Like.query.filter_by(video_id=video_id).first()
    if rating:
        obj = {"likes_count": rating.likes, "dislikes_count": rating.dislikes}
        return obj
    else:
        obj = {"likes_count": 0, "dislikes_count": 0}
        return obj


def serialization(video):
    thumbnail_path = app.config['THUMBNAIL_URL'] + video.thumbnail
    video_path = app.config['VIDEO_URL'] + video.name

    obj = {"id": video.id, "category_id": video.category_id, "admin_id": video.admin_id,
           "title": video.title, "description": video.description, "duration": video.duration, "views": video.views,
           "video_url": video_path, "thumbnail_url": thumbnail_path, "uploaded_on": video.created_at,
           "likes_count": ratings(video.id)['likes_count'], "dislikes_count": ratings(video.id)['dislikes_count']}

    return obj


def video_by_id(id):
    video = Video.query.filter_by(id=id).first()

    if video:
        return serialization(video)
    else:
        return False


@app.route('/videos', methods=['GET'])
def get_videos():
    cat = []
    search = request.args.get('search', None)
    tag_name = request.args.get('tag-name', None)
    category = request.args.get('category', None)
    admin_id = request.args.get('admin_id', None)
    most_viewed = request.args.get('most_viewed', None)
    most_liked = request.args.get('most_liked', None)
    random = request.args.get('random', None)
    page = request.args.get('page', 1)

    if tag_name:
        tag = Tag.query.filter_by(name=tag_name).first()
        if tag:
            video_list = VideoAndTag.query.filter_by(tag_id=tag.id).all()
            video_ids = (video.id for video in video_list)
            videos = Video.query.filter(Video.id.in_(video_ids), Video.is_verified == True) \
                .order_by(Video.created_at.desc()).paginate(page=int(page), per_page=20, error_out=False)
        else:
            return {"message": "No tag found"}, 404
    elif category:
        videos = Video.query.filter(Video.category_id == int(category), Video.is_verified == True) \
            .order_by(Video.created_at.desc()).paginate(page=int(page), per_page=20, error_out=False)

    elif admin_id:
        videos = Video.query.filter_by(admin_id=int(admin_id)).order_by(Video.created_at.desc()).\
            paginate(page=int(page), per_page=20, error_out=False)

    elif search:
        videos = Video.query.filter(Video.title.like('%'+search+'%'), Video.is_verified == True).order_by(
            Video.created_at.desc()).paginate(page=int(page), per_page=20, error_out=False)

        categories = Category.query.filter(Category.name.like('%'+search+'%')).all()

        if categories:
            for categorie in categories:
                cat_obj = {"id": categorie.id, "video_count": categorie.video_count, "views": categorie.views,
                           "created_at": categorie.created_at, "updated_at": categorie.updated_at,
                           "name": categorie.name}
                cat.append(cat_obj)

    elif most_viewed:
        videos = Video.query.filter_by(is_verified=True).order_by(Video.views.desc()).\
            paginate(page=int(page), per_page=20, error_out=False)

    elif random:
        videos = Video.query.filter_by(is_verified=True).paginate(page=int(page), per_page=20, error_out=False)

    elif most_liked:
        vids = Like.query.order_by(Like.likes.desc()).all()
        if vids:
            v = []
            for vid in vids:
                v.append(vid.video_id)
            videos = Video.query.filter(Video.is_verified == True, Video.id.in_(v)).\
                paginate(page=int(page), per_page=20, error_out=False)
        else:
            videos = None
    else:
        videos = Video.query.filter_by(is_verified=True).order_by(Video.created_at.desc())\
            .paginate(page=int(page), per_page=20, error_out=False)

    if videos.items:
        res = []
        for video in videos.items:
            res.append(serialization(video))

        # Pagination
        next_url = videos.next_num if videos.has_next else None
        prev_url = videos.prev_num if videos.has_prev else None

        if next_url:
            next_url = '/videos?page=' + str(next_url)
        if prev_url:
            prev_url = '/videos?page=' + str(prev_url)
        links = {"next_url": next_url, "prev_url": prev_url}

        return {"data": res, "category": cat, "links": links}, 200
    else:
        return {"message": "No video found or video not verified"}, 404


@app.route('/videos/<int:id>', methods=['GET'])
def get_video_by_id(id):
    video = Video.query.filter_by(id=id, is_verified=True).first()

    if video:
        video.views = video.views + 1
        category = Category.query.filter_by(id=video.category_id).first()
        category.views = category.views + 1
        db.session.commit()
        return {"data": serialization(video)}, 200
    else:
        return {"message": "No video found or video not verified"}, 404


@app.route('/videos', methods=['POST'])
def video_store():
    admin_id = request.form.get('admin_id', None)
    filename = request.form.get('filename', None)
    thumbnail_name = request.form.get('thumbnail_name', None)
    category_id = request.form.get('category_id', None)
    title = request.form.get('title', None)
    description = request.form.get('description', None)
    duration = request.form.get('duration', None)

    print("Incoming from Request  ", request.form)
    if not all((category_id, title, filename, thumbnail_name, duration)):
        return {"message": "Category, title & file is required"}, 404

    duration = str(duration).split('.')

    if admin_id:
        video = Video(admin_id=admin_id, category_id=category_id, title=title, description=description, name=filename,
                      is_verified=True, thumbnail=thumbnail_name, duration=duration[0])
    else:
        video = Video(admin_id=admin_id, category_id=category_id, title=title, description=description, name=filename,
                      thumbnail=thumbnail_name, duration=duration[0])

    db.session.add(video)
    db.session.commit()

    return {"data": serialization(video)}, 201


@app.route('/videos/<int:id>', methods=['PATCH'])
@jwt_required
def video_update(id):
    title = request.form.get('title', None)
    category_id = request.form.get('category_id', None)
    description = request.form.get('description', None)

    if not all((category_id, title)):
        return {"message": "Category, title is required"}, 404

    video = Video.query.filter_by(id=id).first()

    if title:
        video.title = title
    if category_id:
        video.category_id = category_id
    if description:
        video.description = description

    db.session.commit()

    return {"data": serialization(video)}, 200


@app.route('/videos/<int:id>', methods=['DELETE'])
@jwt_required
def video_delete(id):
    if Video.query.filter_by(id=id).delete():
        db.session.commit()
        return {"message": "Video deleted successfully"}, 200
    else:
        return {"message": "No video found for delete"}, 404


@app.route('/videos/submit', methods=['GET'])
@jwt_required
def view_video():
    video = Video.query.filter_by(is_verified=False).all()

    if video:
        res = []
        for vid in video:
            res.append(serialization(vid))
        return {"data": res}, 200
    else:
        return {"message": "No video found"}, 404


@app.route('/videos-confirm', methods=['GET'])
@jwt_required
def confirm_video():
    admin_id = get_jwt_identity()
    confirm = request.args.get('confirm', None)
    remove = request.args.get('remove', None)

    if confirm:
        video = Video.query.filter_by(id=confirm).first()
        if video:
            video.is_verified = True
            video.admin_id = admin_id
            db.session.commit()

            return {"data": serialization(video)}, 200
        else:
            return {"message": "Invalid video id"}, 404

    if remove:
        if Video.query.filter_by(id=remove).delete():
            db.session.commit()
            return {"message": "Video removed successfully"}, 200
        else:
            return {"message": "Invalid video id"}, 404

    return {"message": "Please specified confirm or remove parameter"}, 404


# def get_chunk(video_id, byte1=None, byte2=None):
#     full_path = config.basedir + '/' + app.config['UPLOAD_FOLDER_VIDEO'] + '/' + video_by_id(video_id)['name']
#     file_size = os.stat(full_path).st_size
#     start = 0
#     # length = 102400
#
#     if byte1 < file_size:
#         start = byte1
#     if byte2:
#         length = byte2 + 1 - byte1
#     else:
#         length = file_size - start
#
#     with open(full_path, 'rb') as f:
#         f.seek(start)
#         chunk = f.read(length)
#     return chunk, start, length, file_size
#
#
# @app.route('/video/play/<int:video_id>', methods=['GET'])
# def get_file(video_id):
#     range_header = request.headers.get('Range', None)
#     byte1, byte2 = 0, None
#     if range_header:
#         match = re.search(r'(\d+)-(\d*)', range_header)
#         groups = match.groups()
#
#         if groups[0]:
#             byte1 = int(groups[0])
#         if groups[1]:
#             byte2 = int(groups[1])
#
#     chunk, start, length, file_size = get_chunk(video_id, byte1, byte2)
#     resp = Response(chunk, 206, mimetype='video/mp4',
#                     content_type='video/mp4', direct_passthrough=True)
#     resp.headers.add('Content-Range', 'bytes {0}-{1}/{2}'.format(start, start + length - 1, file_size))
#     return resp
