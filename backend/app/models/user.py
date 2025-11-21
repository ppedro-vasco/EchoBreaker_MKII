from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func
from flask_login import UserMixin # <--- IMPORTANTE: Adicione isso
from ..extensions import db, login_manager # <--- Adicione login_manager

class User(UserMixin, db.Model): # <--- Adicione UserMixin aqui
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    analyses = db.relationship('AnalysisHistory', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

# --- Função auxiliar que o Flask-Login exige para carregar o usuário ---
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))