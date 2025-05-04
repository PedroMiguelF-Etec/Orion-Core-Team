import React, { useState } from 'react';

function App() {
  const [mensagem, setMensagem] = useState('');
  const [respostaIA, setRespostaIA] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  const handleMensagemChange = (event) => {
    setMensagem(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/corrigir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensagem }),
      });

      if (response.ok) {
        const data = await response.json();
        setRespostaIA(data.resposta);
      } else {
        setRespostaIA('Erro ao conectar com o servidor.');
      }
    } catch (error) {
      setRespostaIA('Erro ao processar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data.user);
        setShowLogin(false);
      } else {
        alert('Login falhou. Verifique suas credenciais.');
      }
    } catch (error) {
      alert('Erro ao tentar fazer login.');
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        setShowRegister(false);
        setShowLogin(true);
      } else if (response.status === 409) {
        alert('Usuário já registrado.');
      } else {
        alert('Erro ao tentar cadastrar. Tente novamente.');
      }
    } catch (error) {
      alert('Erro ao tentar cadastrar.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div style={styles.container}>
      {/* Barra superior */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>Minha App</h1>
        <div style={styles.navButtons}>
          {isLoggedIn ? (
            <>
              <span style={styles.userInfo}>Bem-vindo, {user?.name || 'Usuário'}</span>
              <button onClick={handleLogout} style={styles.navButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} style={styles.navButton}>
                Login
              </button>
              <button onClick={() => setShowRegister(true)} style={styles.navButton}>
                Cadastro
              </button>
            </>
          )}
        </div>
      </div>

      {/* Formulário de Login */}
      {showLogin && (
        <form onSubmit={handleLoginSubmit} style={styles.authForm}>
          <h2>Login</h2>
          <input type="email" name="email" placeholder="Email" required style={styles.input} />
          <input type="password" name="password" placeholder="Senha" required style={styles.input} />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
      )}

      {/* Formulário de Cadastro */}
      {showRegister && (
        <form onSubmit={handleRegisterSubmit} style={styles.authForm}>
          <h2>Cadastro</h2>
          <input type="text" name="name" placeholder="Nome" required style={styles.input} />
          <input type="email" name="email" placeholder="Email" required style={styles.input} />
          <input type="password" name="password" placeholder="Senha" required style={styles.input} />
          <button type="submit" style={styles.button}>
            Cadastrar
          </button>
        </form>
      )}

      {/* Conteúdo principal */}
      {!showLogin && !showRegister && (
        <>
          <h1 style={styles.title}>Digite sua frase:</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <textarea
              name="mensagem"
              rows="5"
              cols="40"
              placeholder="Digite uma mensagem"
              required
              style={styles.textarea}
              value={mensagem}
              onChange={handleMensagemChange}
            />
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Processando...' : 'Mandar'}
            </button>
          </form>

          {respostaIA && respostaIA !== mensagem && (
            <div style={styles.suggestionContainer}>
              <button type="button" onClick={() => setMensagem(respostaIA)} style={styles.suggestionButton}>
                Sugestão: {respostaIA}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  navbar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#1f1f1f',
    borderBottom: '1px solid #444',
  },
  logo: {
    color: '#fff',
    fontSize: '24px',
  },
  navButtons: {
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#444',
    color: '#fff',
    cursor: 'pointer',
  },
  userInfo: {
    marginRight: '10px',
    fontSize: '16px',
  },
  authForm: {
    backgroundColor: '#222',
    padding: '20px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  input: {
    width: '250px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#444',
    color: '#fff',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textarea: {
    resize: 'none',
    width: '300px',
    height: '100px',
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #fff',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '16px',
  },
  suggestionContainer: {
    marginTop: '20px',
  },
  suggestionButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#555',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default App;