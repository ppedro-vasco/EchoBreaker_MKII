import requests
import json
import os

# Configurações
BASE_URL = "http://127.0.0.1:5000/api"
EMAIL = "cientista@tcc.com"      # Mesmo usuário criado no teste anterior
PASSWORD = "senha_segura_123"
JSON_FILE = "scripts/data/historico_teste.json" # O arquivo que vamos gerar

def run_test():
    # 1. Obter diretório correto
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Ajusta caminho para pegar o JSON dentro de scripts/data/
    # Se seu script estiver em 'scripts/', o data está em 'data/'
    json_path = os.path.join(current_dir, '..', 'scripts', 'data', 'historico_teste.json')
    
    # Correção caso esteja rodando da raiz
    if not os.path.exists(json_path):
        json_path = "scripts/data/historico_teste.json"

    if not os.path.exists(json_path):
        print(f"[ERRO] Arquivo de teste não encontrado: {json_path}")
        print("Execute o passo 1 (coletor) primeiro!")
        return

    session = requests.Session()

    # 2. Fazer Login (para pegar o cookie de sessão)
    print("--- 1. Realizando Login ---")
    resp_login = session.post(f"{BASE_URL}/auth/login", json={
        "email": EMAIL, 
        "password": PASSWORD
    })
    
    if resp_login.status_code != 200:
        print(f"Falha no login: {resp_login.text}")
        return
    print("Login OK!")

    # 3. Fazer Upload do Arquivo
    print("\n--- 2. Enviando Histórico para Análise ---")
    
    # Abre o arquivo em modo leitura binária ('rb')
    with open(json_path, 'rb') as f:
        files = {'file': ('historico.json', f, 'application/json')}
        
        # Post para a rota de análise
        resp_analysis = session.post(f"{BASE_URL}/analysis/analyze", files=files)
        
        print(f"Status Code: {resp_analysis.status_code}")
        
        if resp_analysis.status_code == 200:
            data = resp_analysis.json()
            print("\n--- SUCESSO! RELATÓRIO RECEBIDO ---")
            print(f"Entropia: {data['analysis']['entropy']}")
            print(f"Severidade: {data['analysis']['severity']}")
            print(f"\nTop Categorias (Snapshot):")
            print(data['analysis']['details'])
            
            print(f"\n--- RECOMENDAÇÕES DO BANCO ({len(data['suggestions'])}) ---")
            for vid in data['suggestions']:
                print(f"- {vid['title']} [{vid['category_name']}] ({vid['duration_seconds']}s)")
        else:
            print("Erro na análise:")
            print(resp_analysis.text)

if __name__ == "__main__":
    run_test()