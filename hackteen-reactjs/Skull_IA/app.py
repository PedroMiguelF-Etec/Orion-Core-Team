from openai import OpenAI
import time
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_cors import CORS

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
)

app = Flask(__name__)
CORS(app)

app.secret_key = "segredo_aleatorio_123"

@app.route('/', methods=['GET', 'POST'])
def index():
    mensagem = session.get('mensagem', '')
    resposta = session.get('resposta', '')
    palavra = session.get('PalavraIA', '')

    if request.method == 'POST':
        mensagem = request.form.get('mensagem')

        # Salva os dados na sessão
        session['mensagem'] = mensagem
        session['resposta'] = resposta
    
    return render_template('index.html',  mensagem=mensagem, respostaIA=resposta, palavra=palavra)

@app.route('/corrigir', methods=['POST'])
def corrigir():
    mensagem_corrigida = session.get('resposta', '')
    if mensagem_corrigida:
        session['mensagem'] = mensagem_corrigida
        session['resposta'] = ''
    return redirect(url_for('index'))

# Novo endpoint para integração com o React
@app.route('/api/corrigir', methods=['POST'])
def api_corrigir():
    if request.is_json:  # Verifique se a requisição é JSON
        data = request.get_json()  # Use .get_json() para garantir que o conteúdo seja tratado como JSON
        mensagem = data.get('mensagem', '')
        if not mensagem:
            return jsonify({'error': 'Mensagem não fornecida'}), 400
    else:
        return jsonify({'error': 'Content-Type não é application/json'}), 415

    # Reutilizando a lógica existente para processar a mensagem
    chat = client.chat.completions.create(
        model="google/gemma-3-27b-it:free",
        seed=time.time_ns(),
        messages=[
            {"role": "developer", "content": "responda apenas com o mesmo texto mas corrigido, sem mudar o contexto. e evite colocar coisas a mais, apenas o texto corrigido."},
            {"role": "user", "content": mensagem}
        ],
    )
    if chat.choices == None:
        print(chat.choices)
        try:
            print(chat.error.message)
            print(chat.error.code)
        except:
            pass

    if chat and chat.choices:
        resposta = chat.choices[0].message.content.strip()
        if not resposta:
            resposta = "Desculpe, não consegui entender sua mensagem."
    else:
        resposta = "A IA não retornou uma resposta válida. Tente novamente."

    session['resposta'] = resposta
    return jsonify({'resposta': resposta}), 200

@app.route('/adicionar', methods=['POST'])
def adicionar():
    mensagem = session.get('mensagem', '')
    palavra = session.get('PalavraIA', '')
    if palavra:
        session['mensagem'] = mensagem + " " + palavra
        session['PalavraIA'] = ''
    return redirect(url_for('index'))

@app.route('/api/adicionar', methods=['POST'])
def api_adicionar():
    data = request.json  
    mensagem = data.get('mensagem', '')  # Acessa a mensagem no JSON

    if not mensagem:
        return jsonify({'error': 'Mensagem não fornecida'}), 400

    # Reutilizando a lógica existente para processar a mensagem
    chat = client.chat.completions.create(
        model="google/gemma-3-27b-it:free",
        seed=time.time_ns(),
        messages=[
            {"role": "developer", "content": "responda de forma que continue a frase, mas não mude o contexto. considere mais a primeira palavra da frase."},
            {"role": "user", "content": mensagem}
        ],
    )
    if chat.choices == None:
        print(chat.choices)
        try:
            print(chat.error.message)
            print(chat.error.code)
        except:
            pass

    if chat and chat.choices:
        palavra = chat.choices[0].message.content.strip().split()[0]  
        if not palavra:
            palavra = "Desculpe, não consegui entender sua mensagem."
    else:
        palavra = "A IA não retornou uma resposta válida. Tente novamente."

    session['PalavraIA'] = palavra
    return jsonify({'palavra': palavra}), 200
    

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/api/login', methods=['POST'])
def api_login():
    if not request.is_json:
        return jsonify({'error': 'Content-Type não é application/json'}), 415

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400

    # Simulação de autenticação (substitua por lógica de banco de dados)
    if email == "teste@teste.com" and password == "123456":
        user = {'name': 'Usuário Teste', 'email': email}
        return jsonify({'message': 'Login bem-sucedido', 'user': user}), 200
    else:
        return jsonify({'error': 'Credenciais inválidas'}), 401


@app.route('/api/register', methods=['POST'])
def api_register():
    if not request.is_json:
        return jsonify({'error': 'Content-Type não é application/json'}), 415

    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Nome, email e senha são obrigatórios'}), 400

    # Simulação de registro (substitua por lógica de banco de dados)
    if email == "teste@teste.com":
        return jsonify({'error': 'Usuário já registrado'}), 409

    return jsonify({'message': 'Cadastro realizado com sucesso!'}), 201