# EchoBreaker MK II - Quebrando Bolhas de Filtro

Sistema autônomo de análise de diversidade de consumo e recomendação de conteúdo para mitigar o efeito de câmaras de eco no YouTube.

## 🚀 Funcionalidades
- **Diagnóstico de Bolha:** Utiliza a **Entropia de Shannon** para calcular matematicamente a diversidade do histórico do usuário.
- **Motor de Recomendação SQL:** Sistema de filtragem avançada que elimina filmes longos e prioriza categorias não exploradas pelo usuário.
- **Coleta Autônoma (ETL):** Um serviço agendado (`APScheduler`) que roda em background, monitorando o YouTube e populando o banco de dados com conteúdos educativos e diversos automaticamente.
- **API RESTful:** Backend estruturado em Flask com autenticação segura e arquitetura em camadas.

## 🛠️ Tecnologias
- **Backend:** Python, Flask, SQLAlchemy (ORM).
- **Automação:** APScheduler, yt-dlp.
- **Dados:** SQLite (Dev) / PostgreSQL (Prod), Pandas.
- **Algoritmos:** Cálculo de Entropia de Shannon, Filtragem Colaborativa baseada em Conteúdo.

## 🔧 Como Rodar
1. Clone o repositório.
2. Backend:
   ```bash
   cd backend
   python -m venv venv
   pip install -r requirements.txt
   python run.py
   ```