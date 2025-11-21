from sqlalchemy.sql import func
from ..extensions import db

class RecommendationVideo(db.Model):
    """
    Base Global de Sugestões.
    Esta tabela é populada pelo script ETL (coletor) e consumida por TODOS os usuários.
    """
    __tablename__ = 'recommendation_videos'

    id = db.Column(db.Integer, primary_key=True)
    
    # ID do YouTube (chave natural para evitar duplicatas)
    video_id = db.Column(db.String(20), unique=True, nullable=False, index=True)
    
    title = db.Column(db.String(255), nullable=False)
    channel = db.Column(db.String(100), nullable=False)
    published_at = db.Column(db.DateTime, nullable=True)
    
    category_id = db.Column(db.Integer, nullable=False)
    category_name = db.Column(db.String(50), nullable=False)
    
    # FILTRO DE FILMES: Permite excluir vídeos > X segundos
    duration_seconds = db.Column(db.Integer, nullable=False, default=0)
    
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "video_id": self.video_id,
            "title": self.title,
            "channel": self.channel,
            "publishedAt": self.published_at.isoformat() if self.published_at else None,
            "category_name": self.category_name,
            "duration_seconds": self.duration_seconds
        }