import sys
import os
import json
from datetime import datetime

# --- PATH ---
# 1. Pega o diretório atual (scripts/etl)
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Define o caminho para a pasta 'backend'
# Sobe dois níveis (..) e entra em 'backend'
backend_path = os.path.abspath(os.path.join(current_dir, '..', '..', 'backend'))

# 3. Adiciona a pasta 'backend' ao sys.path
sys.path.append(backend_path)
# -------------------------------------

from app import create_app, db
from app.models import RecommendationVideo

# Inicializa o app
app = create_app()

def load_json_data(filepath):
    """Lê o arquivo JSON gerado pelo coletor."""
    if not os.path.exists(filepath):
        print(f"[ERRO] Arquivo não encontrado: {filepath}")
        return []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def seed_database(json_file_path):
    """Insere os dados do JSON no Banco SQL."""
    print(f"--- Iniciando Carga de Dados de: {json_file_path} ---")
    
    videos_data = load_json_data(json_file_path)
    count_new = 0
    count_existing = 0

    # AppDbContext
    with app.app_context():
        for item in videos_data:
            video_id = item.get('video_id')
            
            # Validação básica
            if not video_id:
                continue

            # Verifica se já existe no banco (evita duplicatas)
            exists = RecommendationVideo.query.filter_by(video_id=video_id).first()
            if exists:
                count_existing += 1
                continue

            # Tratamento de Data
            pub_date_str = item.get('publishedAt')
            pub_date = None
            if pub_date_str:
                try:
                    pub_date = datetime.fromisoformat(pub_date_str.replace('Z', '+00:00'))
                except ValueError:
                    pass # Mantém None se der erro

            # Cria o objeto SQL
            new_video = RecommendationVideo(
                video_id=video_id,
                title=item.get('title', 'Sem Título'),
                channel=item.get('channel', 'Desconhecido'),
                published_at=pub_date,
                category_id=int(item.get('categoryId', 0)),
                category_name=str(item.get('categoryId')), # Temporário, ideal é ter o nome
                duration_seconds=item.get('duration_seconds', 0)
            )

            db.session.add(new_video)
            count_new += 1

        # (Commit)
        try:
            db.session.commit()
            print(f"--- Sucesso! ---")
            print(f"Novos vídeos inseridos: {count_new}")
            print(f"Vídeos já existentes (ignorados): {count_existing}")
        except Exception as e:
            db.session.rollback()
            print(f"[ERRO] Falha ao salvar no banco: {e}")

if __name__ == "__main__":
    json_path = os.path.join(current_dir, '..', 'data', 'base_simulada.json')
    seed_database(json_path)