import yt_dlp
import json
import os
from datetime import datetime

class EnrichmentService:
    
    # Caminho onde vamos salvar o JSON pronto (ajuste se necessário)
    # Aqui ele tenta salvar em scripts/data/
    OUTPUT_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'scripts', 'data'))

    CATEGORY_MAP = {
        "Film & Animation": 1, "Autos & Vehicles": 2, "Music": 10, 
        "Pets & Animals": 15, "Sports": 17, "Travel & Events": 19, 
        "Gaming": 20, "People & Blogs": 22, "Comedy": 23, 
        "Entertainment": 24, "News & Politics": 25, "Howto & Style": 26, 
        "Education": 27, "Science & Technology": 28, "Nonprofits & Activism": 29
    }

    @staticmethod
    def process_and_save_txt(file_stream, filename="historico_convertido.json"):
        """
        Lê TXT -> Extrai Metadados -> Salva JSON no disco.
        """
        # Garante que a pasta existe
        if not os.path.exists(EnrichmentService.OUTPUT_FOLDER):
            os.makedirs(EnrichmentService.OUTPUT_FOLDER)

        # 1. Ler URLs
        try:
            content = file_stream.read().decode('utf-8')
        except:
            file_stream.seek(0)
            content = file_stream.read().decode('latin-1')
            
        urls = [line.strip() for line in content.splitlines() if line.strip() and "youtube.com" in line]
        
        # LIMITADOR DE SEGURANÇA (Para não travar seu teste agora)
        # Remova ou aumente esse slice [:50] quando quiser processar tudo
        urls_to_process = urls[:50] 
        
        print(f"--- [ENRICHMENT] Iniciando conversão de {len(urls_to_process)} URLs ---")

        processed_videos = []
        
        ydl_opts = {
            'quiet': True,
            'skip_download': True,
            'ignoreerrors': True,
            'no_warnings': True,
            'extract_flat': False
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            for url in urls_to_process:
                try:
                    info = ydl.extract_info(url, download=False)
                    if not info: continue

                    cat_name = info.get('categories', ['General'])[0] if info.get('categories') else 'General'
                    cat_id = EnrichmentService.CATEGORY_MAP.get(cat_name, 0)

                    # Formata data
                    published_at = None
                    if info.get('upload_date'):
                         published_at = f"{info['upload_date'][:4]}-{info['upload_date'][4:6]}-{info['upload_date'][6:]}T00:00:00Z"

                    video_obj = {
                        "video_id": info.get('id'),
                        "title": info.get('title'),
                        "channel": info.get('channel'),
                        "publishedAt": published_at,
                        "categoryId": cat_id,
                        "category_name": cat_name,
                        "duration_seconds": info.get('duration', 0)
                    }
                    processed_videos.append(video_obj)
                    print(f"   [OK] {video_obj['title'][:30]}...")

                except Exception as e:
                    print(f"   [FALHA] {url}: {e}")

        # 2. Salvar no Disco
        output_path = os.path.join(EnrichmentService.OUTPUT_FOLDER, filename)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(processed_videos, f, indent=2, ensure_ascii=False)
            
        print(f"--- [ENRICHMENT] Salvo em: {output_path} ---")
        return {
            "success": True, 
            "total_processed": len(processed_videos),
            "path": output_path
        }