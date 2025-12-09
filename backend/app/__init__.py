from flask import Flask
from flask_cors import CORS
from flask_apscheduler import APScheduler
from datetime import datetime, timedelta
from config import Config
from .extensions import db, migrate, login_manager


scheduler = APScheduler()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, supports_credentials=True)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    scheduler.init_app(app)
    scheduler.start()
    
    from app import models
    from .routes.auth_routes import auth_bp
    from .routes.analysis_routes import analysis_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(analysis_bp)

    from .services.recommendation_service import RecommendationService

    @scheduler.task('interval', id='do_update_videos_interval', hours=12, misfire_grace_time=900)
    def scheduled_update():
        with app.app_context():
            RecommendationService.populate_database()

    try:
        run_time = datetime.now() + timedelta(seconds=5)
        @scheduler.task('date', id='do_update_videos_startup', run_date=run_time)
        def startup_update():
            with app.app_context():
                print("\n--- [AGENDADOR] Executando carga inicial de vídeos... ---")
                RecommendationService.populate_database()
    except Exception as e:
        print(f"Erro ao agendar startup: {e}")

    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'db': 'connected'}

    return app