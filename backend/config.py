import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'uma-chave-muito-secreta-dev'
    # Usaremos SQLite para desenvolvimento local.
    # Para produção, basta mudar essa string para PostgreSQL.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'echobreaker.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False