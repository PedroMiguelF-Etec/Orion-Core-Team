// filepath: src/api/login.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
  
      // Simulação de autenticação com JSON
      const users = [
        { email: 'teste@teste.com', password: '123456', name: 'Usuário Teste' },
      ];
  
      const user = users.find((u) => u.email === email && u.password === password);
  
      if (user) {
        res.status(200).json({ message: 'Login bem-sucedido', user: { name: user.name, email: user.email } });
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } else {
      res.status(405).json({ error: 'Método não permitido' });
    }
  }