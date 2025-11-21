import math
from collections import Counter
from sqlalchemy import func
from ..models import RecommendationVideo
from ..extensions import db

class BubbleService:
    
    @staticmethod
    def calculate_entropy(categories):
        """
        Calcula a Entropia de Shannon para medir a diversidade do consumo.
        Fórmula: H(X) = - sum(P(xi) * log2(P(xi)))
        """
        total = len(categories)
        if total == 0:
            return 0.0
        
        counts = Counter(categories)
        entropy = 0.0
        
        for count in counts.values():
            probability = count / total
            entropy -= probability * math.log2(probability)
            
        return entropy

    @staticmethod
    def classify_severity(entropy):
        """Define a gravidade da bolha baseada na entropia."""
        if entropy < 1.5:
            return "Alta"
        elif entropy < 2.5:
            return "Média"
        else:
            return "Baixa"

    @staticmethod
    def analyze_history(video_list):
        """
        Processa a lista de vídeos do histórico (input do usuário).
        Retorna: Entropia, Severidade e Top Categorias.
        """
        # Extrai apenas os IDs de categoria
        category_ids = [v['categoryId'] for v in video_list if 'categoryId' in v]
        
        # 1. Cálculo da Bolha
        entropy = BubbleService.calculate_entropy(category_ids)
        severity = BubbleService.classify_severity(entropy)
        
        # 2. Identificar Categorias Dominantes (para excluir das recomendações)
        counts = Counter(category_ids)
        total_videos = len(category_ids)
        dominant_categories = []
        
        # Consideramos dominante se representa > 15% do consumo (ajustável)
        for cat_id, count in counts.items():
            if (count / total_videos) > 0.15:
                dominant_categories.append(cat_id)
                
        # Prepara snapshot para salvar no banco
        top_categories_snapshot = dict(counts.most_common(5))
        
        return {
            "entropy": round(entropy, 2),
            "severity": severity,
            "dominant_ids": dominant_categories,
            "snapshot": top_categories_snapshot
        }

    @staticmethod
    def generate_recommendations(dominant_category_ids, limit=10):
        """
        Busca no BANCO DE DADOS vídeos que estão FORA da bolha do usuário.
        """
        print(f"[DEBUG] Buscando recomendações. Ignorando categorias: {dominant_category_ids}")

        # --- QUERY INTELIGENTE SQL ---
        # 1. Filtra categorias que o usuário já vê muito (Furando a bolha)
        # 2. Filtra vídeos muito longos (Eliminando Filmes: > 40 min / 2400s)
        # 3. Ordena aleatoriamente (func.random()) para variar as sugestões
        
        query = RecommendationVideo.query.filter(
            RecommendationVideo.category_id.notin_(dominant_category_ids),
            RecommendationVideo.duration_seconds < 2400  # <--- REGRA ANTI-FILME
        ).order_by(func.random()).limit(limit)
        
        recommendations = query.all()
        
        return [rec.to_dict() for rec in recommendations]