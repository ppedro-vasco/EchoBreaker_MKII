from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager

# Inicializamos as extensões sem vinculá-las ao 'app' ainda.
# Isso será feito no __init__.py principal via o padrão 'init_app'.
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()