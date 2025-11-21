from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from ..models import User
from ..extensions import db

# Cria um "pacote" de rotas chamado 'auth'
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validação básica
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Dados inválidos'}), 400
    
    # Verifica se já existe
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email já cadastrado'}), 400
        
    # Cria usuário
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Usuário criado com sucesso!'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')):
        login_user(user) # Cria a sessão no servidor
        return jsonify({
            'message': 'Login realizado',
            'user': {'id': user.id, 'username': user.username}
        })
        
    return jsonify({'error': 'Credenciais inválidas'}), 401

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout realizado'})

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Rota para o Frontend verificar se o usuário já está logado ao recarregar a página"""
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email
    })