from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

app = Flask(__name__, static_url_path='')
app.config.from_object(Config)
CORS(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db, compare_type=True)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

from api import admin, category, tag, video, likes
from api.sub_admin import sub_admin

import models.admin
import models.category
import models.tag
import models.video
import models.video_and_tag
import models.likes
import models.sub_admin


@app.route('/', methods=['GET'])
def index():
    return "Hello World!"


@app.route('/static/<path:path>/<string:file>', methods=['GET', 'POST'])
def serve_static_resources(path, file):
    return send_from_directory(path, file)


@app.after_request
def after_request(response):
    response.headers.add('Accept-Ranges', 'bytes')
    return response


if __name__ == '__main__':
    app.run(threaded=True)
