from app import create_app, db
from app.models import User, AnalysisHistory, RecommendationVideo

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Video': RecommendationVideo}

if __name__ == '__main__':
    app.run(debug=True)