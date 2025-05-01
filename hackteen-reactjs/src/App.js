import React, { useState } from 'react';

function App() {
  const [mensagem, setMensagem] = useState('');
  const [respostaIA, setRespostaIA] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMensagemChange = (event) => {
    setMensagem(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Faz a requisição para o backend Flask
      const response = await fetch('http://127.0.0.1:5000/api/corrigir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensagem }), // Envia a mensagem como JSON
      });

      if (response.ok) {
        const data = await response.json();
        setRespostaIA(data.resposta); // Define a resposta retornada pelo Flask
      } else {
        setRespostaIA('Erro ao conectar com o servidor.');
      }
    } catch (error) {
      setRespostaIA('Erro ao processar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleCorrigir = () => {
    setMensagem(respostaIA);
    setRespostaIA('');
  };

  return (
    <div>
      <h1>Digite sua frase:</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="mensagem"
          rows="5"
          cols="40"
          placeholder="Digite uma mensagem"
          required
          style={{ resize: 'none', width: '300px', height: '100px' }}
          value={mensagem}
          onChange={handleMensagemChange}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Processando...' : 'Mandar'}
        </button>
      </form>

      {respostaIA && respostaIA !== mensagem && (
        <form onSubmit={(e) => e.preventDefault()}>
          <button type="button" onClick={handleCorrigir}>
            Sugestão: {respostaIA}
          </button>
        </form>
      )}
    </div>
  );
}

export default App;