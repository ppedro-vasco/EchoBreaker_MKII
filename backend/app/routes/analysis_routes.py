import json
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime

from ..services.bubble_service import BubbleService
from ..models import AnalysisHistory
from ..extensions import db

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api/analysis')

@analysis_bp.route('/analyze', methods=['POST'])
@login_required # <--- Só aceita se estiver logado!
def analyze_history():
    # 1. Recebimento do Arquivo
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    
    try:
        # Lê o JSON enviado pelo usuário
        data = json.load(file)
        
        # O JSON pode ser uma lista direta ou estar dentro de chaves, dependendo da origem
        # Assumindo que é uma lista de vídeos conforme seu padrão anterior
        if isinstance(data, dict):
            # Tenta achar a lista se estiver aninhada
            video_list = data.get('videos') or data.get('history') or []
        else:
            video_list = data
            
        if not video_list:
            return jsonify({'error': 'JSON vazio ou formato inválido'}), 400

        # 2. Executa a Lógica Científica (Service)
        analysis_result = BubbleService.analyze_history(video_list)
        
        # 3. Salva o Diagnóstico no Banco (Persistência)
        # Isso permite gerar gráficos de evolução depois
        history_entry = AnalysisHistory(
            user_id=current_user.id,
            entropy_score=analysis_result['entropy'],
            severity=analysis_result['severity'],
            dominant_categories_snapshot=json.dumps(analysis_result['snapshot'])
        )
        db.session.add(history_entry)
        db.session.commit()
        
        # 4. Gera Recomendações baseadas no Banco SQL
        suggestions = BubbleService.generate_recommendations(
            dominant_category_ids=analysis_result['dominant_ids']
        )
        
        # 5. Retorno para o Frontend
        return jsonify({
            "analysis": {
                "entropy": analysis_result['entropy'],
                "severity": analysis_result['severity'],
                "details": analysis_result['snapshot']
            },
            "suggestions": suggestions,
            "saved_at": datetime.now().isoformat()
        }), 200

    except Exception as e:
        print(f"[ERRO] Processamento de análise: {e}")
        return jsonify({'error': 'Falha ao processar arquivo'}), 500