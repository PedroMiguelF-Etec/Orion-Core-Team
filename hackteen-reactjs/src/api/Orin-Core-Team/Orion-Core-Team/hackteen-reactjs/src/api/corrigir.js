import OpenAI from 'openai';

const openai = new OpenAI({
  base_url: "https://openrouter.ai/api/v1",
  apiKey: "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",
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ error: 'Mensagem não fornecida' });
    }

    try {
      const chat = await openai.chat.completions.create({
        model: "google/gemma-3-27b-it:free",
        seed: Date.now(),
        messages: [
          { "role": "developer", "content": "responda apenas com o mesmo texto mas corrigido, sem mudar o contexto. e evite colocar coisas a mais, apenas o texto corrigido." },
          { "role": "user", "content": mensagem }
        ],
      });

      if (!chat || !chat.choices || chat.choices.length === 0) {
        console.error("Erro: Resposta da IA inválida:", chat);
        return res.status(500).json({ error: "A IA não retornou uma resposta válida. Tente novamente." });
      }

      const resposta = chat.choices[0].message.content.trim();
      if (!resposta) {
        return res.status(500).json({ error: "Desculpe, não consegui entender sua mensagem." });
      }

      return res.status(200).json({ resposta: resposta });
    } catch (error) {
      console.error('Erro ao processar a solicitação:', error);
      return res.status(500).json({ error: 'Erro ao processar a solicitação' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}