let notes = {}; // Objeto para armazenar as notas dos usuários

export default function handler(req, res) {
  const { userId } = req.query; // Pega o ID do usuário da query string
  const { note } = req.body; // Pega a nota do corpo da requisição

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (req.method === 'GET') {
    // Retorna a nota do usuário
    const userNote = notes[userId] || '';
    return res.status(200).json({ note: userNote });
  } else if (req.method === 'POST') {
    // Salva a nota do usuário
    notes[userId] = note;
    return res.status(200).json({ message: 'Note saved successfully' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}