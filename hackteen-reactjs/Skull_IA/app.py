from openai import OpenAI
import time
from flask import Flask, render_template, request, redirect, url_for, session, jsonify

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
)

app = Flask(__name__)

app.secret_key = "segredo_aleatorio_123"

mensagem_salva = ""
resposta_salva = ""

@app.route('/', methods=['GET', 'POST'])
def index():
    mensagem = session.get('mensagem', '')
    resposta = session.get('resposta', '')

    if request.method == 'POST':
        mensagem = request.form.get('mensagem')

        # Fazer a chamada para a IA com o texto original
        if mensagem:
            chat = client.chat.completions.create(
                model="google/gemma-3-1b-it:free",
                seed=time.time_ns(),
                messages=[
                    {"role": "developer", "content": "responda apenas com o mesmo texto mas corrigido, sem mudar o contexto."},
                    {"role": "user", "content": mensagem}
                ],
            )
            print("Resposta da API:", chat)

            if chat and chat.choices:
                resposta = chat.choices[0].message.content.strip()
                if not resposta:
                    resposta = "Desculpe, não consegui entender sua mensagem."
            else:
                resposta = "A IA não retornou uma resposta válida. Tente novamente."

        # Salva os dados na sessão
        session['mensagem'] = mensagem
        session['resposta'] = resposta

    return render_template('index.html', mensagem=mensagem, respostaIA=resposta)

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
    data = request.json
    mensagem = data.get('mensagem', '')

    if not mensagem:
        return jsonify({'error': 'Mensagem não fornecida'}), 400

    # Reutilizando a lógica existente para processar a mensagem
    chat = client.chat.completions.create(
        model="openai/gpt-4",
        seed=time.time_ns(),
        messages=[
            {"role": "developer", "content": "responda apenas com o mesmo texto mas corrigido, sem mudar o contexto."},
            {"role": "user", "content": mensagem}
        ],
    )

    if chat and chat.choices:
        resposta = chat.choices[0].message.content.strip()
        if not resposta:
            resposta = "Desculpe, não consegui entender sua mensagem."
    else:
        resposta = "A IA não retornou uma resposta válida. Tente novamente."

    return jsonify({'resposta': resposta})

if __name__ == '__main__':
    app.run(debug=True)