from flask import Blueprint, request, jsonify
from flask_login import login_required
from ..services.enrichment_service import EnrichmentService

tools_bp = Blueprint('tools', __name__, url_prefix='/api/tools')

@tools_bp.route('/convert-txt', methods=['POST'])
@login_required
def convert_txt():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    
    if not file.filename.endswith('.txt'):
        return jsonify({'error': 'Apenas arquivos .txt são aceitos aqui'}), 400

    try:
        # Chama o serviço que processa e salva
        result = EnrichmentService.process_and_save_txt(file)
        
        return jsonify({
            "message": "Conversão concluída com sucesso!",
            "details": result
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500