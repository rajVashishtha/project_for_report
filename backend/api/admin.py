import random

from flask import request, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app import app, db
from models.admin import Admin
from flask_mail import Mail, Message

mail = Mail(app)


def name(id):
    admin = Admin.query.filter_by(id=id).first()
    return admin.name


@app.route('/resendOTP', methods=['POST'])
def resend_otp():
    email = request.form.get('email', None)

    if not all(email):
        return {"message": "email is required"}, 404

    admin = Admin.query.filter_by(email=email).first()
    if admin:
        otp = random.randint(100000, 999999)
        admin.otp = otp
        db.session.add(admin)
        db.session.commit()

        to = email
        subject = "Account login"
        template = "login"
        data = {
            "email": to,
            "otp": otp
        }
        msg = Message(subject, recipients=[to], sender=app.config['FLASKY_MAIL_SENDER'])
        msg.html = render_template(template + '.html', data=data)
        mail.send(msg)

        return {"message": "OTP send"}, 200
    else:
        return {"message": "Invalid email"}, 404


@app.route('/verify-otp', methods=['POST'])
def verify_admin():
    otp = request.form.get('otp', None)
    email = request.form.get('email', None)

    if not all((otp, email)):
        return {"message": "otp & email is required"}, 404

    admin = Admin.query.filter_by(email=email).first()
    if admin:
        if admin.verified:
            res = []
            if int(otp) == admin.otp:
                access_token = create_access_token(identity=admin.id, expires_delta=app.config['JWT_TOKEN_LIFETIME'],
                                                   fresh=True)
                obj = {"token_type": "Bearer", "access_token": access_token, "id": admin.id,
                       "name": admin.name, "email": admin.email, "join_on": admin.created_at,
                       "is_super": admin.type, "added_by": admin.added_by}
                res.append(obj)
                return {"data": res}, 200
            else:
                return {"message": "Invalid otp"}, 404
        else:
            return {"message": "Account is not verified by Superuser yet"}, 404
    else:
        return {"message": "Invalid email id"}, 404


@app.route('/admins', methods=['GET'])
def get():
    name = request.args.get('name', None)
    if name:
        admins = Admin.query.filter(Admin.name.like(name)).all()
    else:
        admins = Admin.query.all()

    res = []
    for admin in admins:
        obj = {"id": admin.id, "name": admin.name, "email": admin.email, "join_on": admin.created_at,
               "is_super": admin.type, "added_by": admin.added_by}
        res.append(obj)
    return {"data": res}, 200


@app.route('/admins/<int:id>', methods=['GET'])
def get_by_id(id):
    admins = Admin.query.filter_by(id=id)

    res = []
    for admin in admins:
        obj = {"id": admin.id, "name": admin.name, "email": admin.email, "join_on": admin.created_at,
               "is_super": admin.type, "added_by": admin.added_by}
        res.append(obj)
    return {"data": res}, 200


@app.route('/admins/register', methods=['POST'])
@jwt_required
def store():
    name = request.form.get('name', None)
    email = request.form.get('email', None)
    user_id = get_jwt_identity()

    if not all((name, email)):
        return {"message": "All fields are required"}, 404

    admin = Admin.query.filter_by(email=email).first()
    if admin:
        return {"message": "Account already exist"}, 401

    otp = random.randint(100000, 999999)
    admin = Admin(name=name, email=email, otp=otp, added_by=user_id)
    db.session.add(admin)
    db.session.commit()

    to = email
    subject = "Account registered on Redjungle"
    template = "registration"
    data = {
        "email": to,
        "otp": otp
    }
    msg = Message(subject, recipients=[to], sender=app.config['FLASKY_MAIL_SENDER'])
    msg.html = render_template(template + '.html', data=data)
    mail.send(msg)

    return {"message": "Account registered"}, 201


@app.route('/admins/login', methods=['POST'])
def admin_login():
    email = request.form.get('email', None)

    if not all(email):
        return {"message": "All fields are required"}, 404

    admin = Admin.query.filter_by(email=email).first()

    if admin:
        if admin.verified:
            # send OTP via mail
            otp = random.randint(100000, 999999)
            admin.otp = otp
            db.session.add(admin)
            db.session.commit()

            to = email
            subject = "Account login"
            template = "login"
            data = {
                "email": to,
                "otp": otp
            }
            msg = Message(subject, recipients=[to], sender=app.config['FLASKY_MAIL_SENDER'])
            msg.html = render_template(template + '.html', data=data)
            mail.send(msg)
            return {"message": "OTP send successfully"}, 200
        else:
            return {"message": "Account is not verified by Superuser yet"}, 404
    else:
        return {"message": "No user found"}, 404


@app.route('/admins/<int:id>', methods=['PATCH'])
@jwt_required
def update(id):
    name = request.form.get('name', None)

    admin = Admin.query.filter_by(id=get_jwt_identity()).first()
    admin.name = name

    db.session.add(admin)
    db.session.commit()

    obj = {"id": admin.id, "name": admin.name, "email": admin.email, "join_on": admin.created_at,
           "is_super": admin.type}
    return {"data": obj}, 200


@app.route('/admins/<int:id>', methods=['DELETE'])
@jwt_required
def delete(id):
    if Admin.query.filter_by(id=id).delete():
        db.session.commit()
        return {"message": "Admin deleted successfully"}, 200
    else:
        return {"message": "Admin already deleted "}, 404


@app.route('/pending-admin', methods=['GET'])
@jwt_required
def get_pending_admin():
    admins = Admin.query.filter_by(verified=False).all()
    if admins:
        res = []
        for admin in admins:
            obj = {"id": admin.id, "name": admin.name, "email": admin.email, "join_on": admin.created_at,
                   "is_super": admin.type, "added_by": name(admin.added_by)}
            res.append(obj)
        return {"data": res}, 200
    else:
        return {"message": "No pending admin"}, 404


@app.route('/pending-admin/<int:id>', methods=['GET'])
@jwt_required
def accept_admin_request(id):
    admins = Admin.query.filter(Admin.id == id, Admin.verified == False).first()
    if admins:
        admins.verified = True
        db.session.add(admins)
        db.session.commit()

        to = admins.email
        subject = "Account registration accepted"
        template = "confirm"
        data = {
            "email": to
        }
        msg = Message(subject, recipients=[to], sender=app.config['FLASKY_MAIL_SENDER'])
        msg.html = render_template(template + '.html', data=data)
        mail.send(msg)

        return {"message": "Admin request accepted"}, 200
    else:
        return {"message": "Admin not found"}, 404


@app.route('/pending-admin/<int:id>', methods=['DELETE'])
@jwt_required
def delete_admin_request(id):
    if Admin.query.filter(Admin.id == id, Admin.verified == False).delete():
        db.session.commit()
        return {"message": "Admin request deleted"}, 200
    else:
        return {"message": "Admin not found"}, 404
