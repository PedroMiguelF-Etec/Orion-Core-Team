export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Simulação de registro com JSON
    const users = [
      { email: 'teste@teste.com', password: '123456', name: 'Usuário Teste' },
    ];

    const userExists = users.find((u) => u.email === email);

    if (userExists) {
      res.status(409).json({ error: 'Usuário já registrado' });
    } else {
      res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}