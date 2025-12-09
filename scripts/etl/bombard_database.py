import sys
import os
import yt_dlp
import time
import random
from datetime import datetime

# --- CORREÇÃO DE CAMINHO ---
# 1. Pega o diretório atual (scripts/etl)
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Aponta para a pasta 'backend' (Sobe 2 niveis e entra em backend)
backend_path = os.path.abspath(os.path.join(current_dir, '..', '..', 'backend'))

# 3. Adiciona ao sistema para o Python achar o 'config.py'
sys.path.append(backend_path)
# ---------------------------

# Agora importamos direto de 'app' (sem o prefixo backend.)
from app import create_app, db
from app.models import RecommendationVideo

app = create_app()

# LISTA MASSIVA DE TÓPICOS (Focados em diversidade e qualidade)
# Misturamos Inglês e Português para dar volume
# TOPICS = [
#     # Ciência e Tech
#     "Quantum Physics Explained", "Astrophysics for beginners", "Neuroscience documentary",
#     "Marine Biology Deep Sea", "Artificial Intelligence Ethics", "Rust Programming Tutorial",
#     "Cybersecurity trends 2025", "SpaceX Starship updates", "Nanotechnology future",
#     "Biomimicry design", "Matemática explicada", "Curiosidades Engenharia Civil",
    
#     # Humanidades e História
#     "Stoicism Philosophy", "History of Rome", "Ancient Egypt Mysteries",
#     "Cold War Documentary", "Psychology of Happiness", "Sociology urbanism",
#     "Modern Art History", "Classical Music Theory", "Jazz History",
#     "Geopolítica Mundial Atual", "História do Brasil Império",
    
#     # Estilo de Vida e Habilidades
#     "Permaculture gardening", "Minimalist living", "Woodworking projects",
#     "Photography composition tips", "Cinematography techniques", "Chess strategies",
#     "Calisthenics workout", "Healthy cooking science", "Coffee brewing methods",
#     "Meditação para iniciantes", "Dicas de Oratória",
    
#     # Natureza e Mundo
#     "National Geographic Documentary", "Deep Ocean Creatures", "Amazon Rainforest wildlife",
#     "Antarctica expedition", "Volcano eruption documentary", "Tornado chasers",
#     "Astronomy Hubble Telescope"
# ]

TOPICS = [
    # Ciência e Tecnologia
    "Deep Learning breakthroughs", "CRISPR gene editing explained", 
    "Black holes documentary", "Climate science and models", 
    "Evolutionary biology basics", "Graph Theory in real life",
    "Quantum computing practical uses", "Python data visualization tutorial",
    "Blockchain beyond cryptocurrencies", "Robotics humanoid prototypes",
    "Tech ethics and digital society",

    # Humanidades e História
    "Philosophy of consciousness", "History of medieval Europe",
    "Silk Road trade history", "Globalization cultural impacts",
    "Political revolutions documentary", "Anthropology tribal cultures",
    "Architecture history overview", "World War I explained",
    "Literature classics analysis", "Sociology of communication",

    # Estilo de Vida e Habilidades
    "Design thinking fundamentals", "DIY electronics beginner projects",
    "Urban sketching techniques", "Digital illustration tips",
    "Productivity systems comparison", "Guitar theory for beginners",
    "Home barista skills", "Yoga mobility routine",
    "Speech improvement exercises", "Sourdough bread baking tutorial",

    # Natureza, Mundo e Documentários
    "Wildlife of African savanna", "Mount Everest expeditions",
    "Coral reef conservation", "Monsoon climate documentary",
    "Arctic wildlife survival", "Rare meteorological phenomena",
    "Planet formation documentary", "Glaciers and climate change"
]

def bombard_database():
    print(f"🚀 INICIANDO OPERAÇÃO DE BOMBARDEIO DE DADOS")
    print(f"🎯 Alvos: {len(TOPICS)} tópicos")
    print(f"🔥 Intensidade: Até 20 vídeos por tópico")
    print("-" * 50)

    # Configuração agressiva mas segura do yt-dlp
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'ignoreerrors': True,
        'skip_download': True,
        'noplaylist': True,
        'extract_flat': False, # Precisamos da duração
        'limit': 20 # Pega 20 vídeos por busca
    }

    count_total_new = 0

    with app.app_context():
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            for index, topic in enumerate(TOPICS):
                print(f"[{index+1}/{len(TOPICS)}] 🔍 Buscando: '{topic}'...")
                
                try:
                    # Busca 20 vídeos do tópico
                    info = ydl.extract_info(f"ytsearch20:{topic}", download=False)
                    
                    if 'entries' not in info:
                        print("   -> Nenhum resultado.")
                        continue

                    count_topic = 0
                    
                    for video in info['entries']:
                        if not video: continue

                        # 1. Checagem de Duplicidade (Rápida)
                        video_id = video.get('id')
                        if RecommendationVideo.query.filter_by(video_id=video_id).first():
                            continue # Já temos, ignora

                        # 2. Filtro Anti-Filme / Anti-Curto demais
                        duration = video.get('duration', 0)
                        if duration > 2400: # > 40 min
                            continue
                        if duration < 60: # < 1 min (Evita shorts muito curtos/ruins)
                            continue

                        # 3. Tratamento de Data
                        pub_date = None
                        if video.get('upload_date'):
                            try:
                                pub_date = datetime.strptime(video.get('upload_date'), '%Y%m%d')
                            except: pass

                        # 4. Inserção
                        new_video = RecommendationVideo(
                            video_id=video_id,
                            title=video.get('title', 'Sem Título')[:250], # Corta título se for gigante
                            channel=video.get('channel', 'Desconhecido'),
                            published_at=pub_date,
                            category_id=0, # ytsearch as vezes não dá ID, o sistema se vira com o nome
                            category_name=video.get('categories', ['Geral'])[0] if video.get('categories') else 'Geral',
                            duration_seconds=duration
                        )
                        db.session.add(new_video)
                        count_topic += 1
                        count_total_new += 1

                    # Salva no banco ao final de cada tópico (Segurança)
                    db.session.commit()
                    print(f"   ✅ Adicionados: {count_topic} vídeos.")
                    
                    # Pausa tática para o YouTube não bloquear seu IP
                    time.sleep(random.uniform(1.5, 3.0))

                except Exception as e:
                    print(f"   ❌ Erro no tópico: {e}")
                    db.session.rollback()

    print("\n" + "="*50)
    print(f"🏁 BOMBARDEIO CONCLUÍDO!")
    print(f"📦 Total de novos vídeos inseridos: {count_total_new}")
    print("="*50)

if __name__ == "__main__":
    bombard_database()