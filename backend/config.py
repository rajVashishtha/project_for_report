import os
import datetime

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    JWT_TOKEN_LIFETIME = datetime.timedelta(days=7)
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgres://mtwvnkcwunatrz:e970ed3d3f366f6d0bed61bc3dc370b327915330e5f228947a51e713f5a7bbdc@ec2-34-196-34-158.compute-1.amazonaws.com:5432/d7hab3ltridr6t'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PROPAGATE_EXCEPTIONS = True
    BASEURL = 'https://red-jungle.herokuapp.com/'
    #BASEURL = 'http://127.0.0.1:5000/'
    VIDEO_URL = 'https://redjungle.s3.ap-south-1.amazonaws.com/videos/'
    # VIDEO_URL = 'http://127.0.0.1:5000/static/uploads/video/'
    THUMBNAIL_URL = 'https://redjungle.s3.ap-south-1.amazonaws.com/thumbnails/'
    # THUMBNAIL_URL = 'http://127.0.0.1:5000/static/uploads/thumbnail/'
    CATEGORY_URL = 'https://red-jungle.herokuapp.com/static/uploads/category/'
    # CATEGORY_URL = 'http://127.0.0.1:5000/static/uploads/category/'
    UPLOAD_FOLDER_VIDEO = 'uploads/video'
    UPLOAD_FOLDER_THUMBNAIL = 'uploads/thumbnail'
    UPLOAD_FOLDER_CATEGORY = 'uploads/category'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or 'redjungles.help@gmail.com'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or 'sumngvemakusyccd'
    FLASKY_MAIL_SUBJECT_PREFIX = '[Redjungle Account Verification]'
    FLASKY_MAIL_SENDER = 'Redjungle Admin <redjungles.help@gmail.com>'
    S3_BUCKET = 'redjungle'
    S3_KEY = 'AKIAXIYSZJUFMC7C7YC6'
    S3_SECRET = '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'
    S3_LOCATION = 'http://{}.s3.amazonaws.com/'.format(S3_BUCKET)
