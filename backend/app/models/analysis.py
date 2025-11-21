from sqlalchemy.sql import func
from ..extensions import db

class AnalysisHistory(db.Model):
    """
    Armazena o DIAGNÓSTICO da bolha.
    Não armazena o histórico bruto de vídeos para economizar espaço e manter privacidade.
    """
    __tablename__ = 'analysis_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    analyzed_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    # Métricas Científicas
    entropy_score = db.Column(db.Float, nullable=False)
    severity = db.Column(db.String(20), nullable=False) # "Alta", "Média", "Baixa"
    
    # Snapshot dos dados (JSON Text) para exibir no dashboard sem reprocessar
    # Ex: '{"Gaming": 50.5, "Music": 10.2}'
    dominant_categories_snapshot = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.analyzed_at.isoformat(),
            "entropy": self.entropy_score,
            "severity": self.severity,
            "dominant_categories": self.dominant_categories_snapshot
        }