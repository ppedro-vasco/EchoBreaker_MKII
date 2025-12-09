import os
import datetime

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'uma-chave-muito-secreta-dev'
    # Usaremos SQLite para desenvolvimento local.
    # Para produção, basta mudar essa string para PostgreSQL.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'echobreaker.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_COOKIE_HTTPONLY = True # Protege contra roubo via JS 
    SESSION_COOKIE_SECURE = False  # False porque estamos em HTTP (localhost), não HTTPS
    SESSION_COOKIE_SAMESITE = 'Lax' # Permite envio entre portas no mesmo IP
    PERMANENT_SESSION_LIFETIME = datetime.timedelta(minutes=60) # Sessão de 1 hora