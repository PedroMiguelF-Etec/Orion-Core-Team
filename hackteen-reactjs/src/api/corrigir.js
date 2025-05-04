export default function handler(req, res) {
    if (req.method === 'POST') {
      const { mensagem } = req.body;
  
      if (!mensagem) {
        return res.status(400).json({ error: 'Mensagem não fornecida' });
      }
  
      // Simulação de correção de mensagem
      const mensagemCorrigida = mensagem.replace(/erro/g, 'correção'); // Exemplo simples
      return res.status(200).json({ resposta: mensagemCorrigida });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }