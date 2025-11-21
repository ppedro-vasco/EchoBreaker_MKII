import requests
import json

BASE_URL = "http://127.0.0.1:5000/api/auth"

def testar_registro(email, password, username):
    print(f"\n--- 1. Testando Registro ({email}) ---")
    payload = {
        "username": username,
        "email": email,
        "password": password
    }
    try:
        response = requests.post(f"{BASE_URL}/register", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Resposta: {response.json()}")
        return response.status_code == 201
    except Exception as e:
        print(f"Erro de conexão: {e}")
        return False

def testar_login(email, password):
    print(f"\n--- 2. Testando Login ---")
    payload = {
        "email": email,
        "password": password
    }
    
    # Session é importante para manter o cookie de login
    session = requests.Session()
    
    response = session.post(f"{BASE_URL}/login", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Resposta: {response.json()}")
    
    if response.status_code == 200:
        print("\n--- 3. Testando Acesso Protegido (/me) ---")
        # Tenta acessar a rota protegida usando a sessão logada
        response_me = session.get(f"{BASE_URL}/me")
        print(f"Status /me: {response_me.status_code}")
        print(f"Usuário Logado: {response_me.json()}")
    else:
        print("Falha no login, pulando teste de sessão.")

if __name__ == "__main__":
    # Dados de teste
    email_teste = "cientista@tcc.com"
    senha_teste = "senha_segura_123"
    user_teste = "CientistaDados"

    # Executa
    if testar_registro(email_teste, senha_teste, user_teste):
        testar_login(email_teste, senha_teste)
    else:
        # Se falhar, tenta logar mesmo assim
        print("Registro falhou (provavelmente usuário já existe). Tentando login...")
        testar_login(email_teste, senha_teste)