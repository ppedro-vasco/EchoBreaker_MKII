import yt_dlp
from datetime import datetime
from ..models import RecommendationVideo
from ..extensions import db

class RecommendationService:
    
    # Temas para buscar automaticamente
    TOPICS = [
        "Documentário Ciência", "História Resumida", "Filosofia Explainer", 
        "Economia Básica", "Música Clássica", "Python Tutorial", 
        "Biologia Curiosidades", "Geopolítica Atual"
    ]

    @staticmethod
    def populate_database():
        """
        Método que o Sistema chama para se auto-atualizar.
        """
        print("--- [SISTEMA] Iniciando atualização automática da Base de Recomendações ---")
        
        ydl_opts = {
            'quiet': True,
            'skip_download': True,
            'noplaylist': True,
            'limit': 5  # Pega 5 vídeos de cada tema por execução para ser rápido
        }

        count_new = 0

        # Usa o contexto do yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            for topic in RecommendationService.TOPICS:
                try:
                    # Busca no YouTube
                    info = ydl.extract_info(f"ytsearch5:{topic}", download=False)
                    
                    if 'entries' not in info: continue

                    for video in info['entries']:
                        video_id = video.get('id')
                        
                        # 1. Verifica se já temos esse vídeo (Evita duplicata)
                        if RecommendationVideo.query.filter_by(video_id=video_id).first():
                            continue

                        # 2. Filtro Anti-Filme (> 40 min)
                        duration = video.get('duration', 0)
                        if duration > 2400: continue

                        # 3. Tratamento de Data
                        pub_date = None
                        if video.get('upload_date'):
                            try:
                                pub_date = datetime.strptime(video.get('upload_date'), '%Y%m%d')
                            except: pass

                        # 4. Salva no Banco
                        new_video = RecommendationVideo(
                            video_id=video_id,
                            title=video.get('title', 'Sem Título'),
                            channel=video.get('channel', 'Desconhecido'),
                            published_at=pub_date,
                            category_id=0, 
                            category_name=video.get('categories', ['Geral'])[0] if video.get('categories') else 'Geral',
                            duration_seconds=duration
                        )
                        db.session.add(new_video)
                        count_new += 1
                    
                    # Comita por tema para salvar progresso parcial
                    db.session.commit()
                
                except Exception as e:
                    print(f"[ERRO AUTO-UPDATE] Falha no tema {topic}: {e}")
                    db.session.rollback()

        print(f"--- [SISTEMA] Atualização concluída. {count_new} novos vídeos adicionados. ---")