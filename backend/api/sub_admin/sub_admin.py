from flask_jwt_extended import create_access_token

from app import app, db, bcrypt
from flask import request
from models.admin import Admin


@app.route('/sub-admins', methods=['GET'])
def get_subadmins():
    name = request.args.get('name', None)

    if name:
        admins = Admin.query.filter(Admin.name.like(name)).all()
    else:
        admins = Admin.query.all()

    if admins:
        res = []
        for admin in admins:
            obj = {"id": admin.id, "name": admin.name, "email": admin.email, "join_on": admin.created_at}
            res.append(obj)
        return {"data": res}, 200
    else:
        return {"message": "No sub admin found"}, 404


@app.route('/sub-admins/<int:id>', methods=['GET'])
def get_by_id_subadmins(id):
    admins = Admin.query.filter_by(id=id).first()

    if admins:
        res = []
        for admin in admins:
            obj = {"id": admin.id, "name": admin.name, "email": admin.email, "join_on": admin.created_at}
            res.append(obj)
        return {"data": res}, 200
    else:
        return {"message": "Invalid sub_admin_id"}, 404


@app.route('/sub-admins/register', methods=['POST'])
def store_subadmins():
    name = request.form.get('name', None)
    email = request.form.get('email', None)
    password = request.form.get('password', None)

    if not all((name, email, password)):
        return {"message": "All fields are required"}, 404

    password_hash = bcrypt.generate_password_hash(password, 10)
    admin = Admin(name=name, email=email, password=password_hash)
    db.session.add(admin)
    db.session.commit()

    access_token = create_access_token(identity=admin.id, fresh=True)
    obj = {"token_type": "Bearer", "access_token": access_token, "id": admin.id,
           "name": admin.name, "email": admin.email, "join_on": admin.created_at, "is_superuser": 0}
    return {"data": obj}, 201


@app.route('/sub-admins/login', methods=['POST'])
def subadmin_login():
    email = request.form.get('email', None)
    password = request.form.get('password', None)

    if not all((email, password)):
        return {"message": "All fields are required"}, 404

    user = Admin.query.filter_by(email=email).first()

    if user:
        res = []
        if bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id, fresh=True)
            obj = {"token_type": "Bearer", "access_token": access_token, "id": user.id,
                   "name": user.name, "email": user.email, "join_on": user.created_at, "is_superuser": 0}
            res.append(obj)
            return {"message": res}, 200
        else:
            return {"message": "Invalid password"}, 404
    else:
        return {"message": "No user found"}, 404


@app.route('/sub-admins/<int:id>', methods=['PATCH'])
def update_subadmins(id):
    name = request.form.get('name', None)

    admin = Admin.query.filter_by(id=id).first()
    admin.name = name

    db.session.add(admin)
    db.session.commit()

    obj = {"id": admin.id, "name": admin.name, "email": admin.email, "join_on": admin.created_at}
    return {"data": obj}, 200


@app.route('/sub-admins/<int:id>', methods=['DELETE'])
def delete_subadmins(id):
    if Admin.query.filter_by(id=id).delete():
        db.session.commit()
        return {"message": "Sub-Admin deleted successfully"}, 200
    else:
        return {"message": "Sub-Admin already deleted "}, 404
