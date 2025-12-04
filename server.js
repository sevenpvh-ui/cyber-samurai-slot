const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve o site e os assets

// Configuração dos Símbolos (Matemática do Jogo)
// O ID deve ser igual ao nome do arquivo da imagem (sem o .png)
const items = [
    { id: 'neon', weight: 60 },     // Mais comum
    { id: 'moeda', weight: 40 },
    { id: 'espada', weight: 30 },
    { id: 'robo', weight: 15 },
    { id: 'samurai', weight: 5 }    // Mais raro (Jackpot)
];

// Função RNG (Gerador de Números Aleatórios)
function getRandomSymbol() {
    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
        if (random < item.weight) {
            return item.id;
        }
        random -= item.weight;
    }
    return items[0].id; // Retorno de segurança
}

app.post('/spin', (req, res) => {
    // 1. Gera o resultado das 3 bobinas
    const reel1 = getRandomSymbol();
    const reel2 = getRandomSymbol();
    const reel3 = getRandomSymbol();

    // 2. Verifica se ganhou (Lógica: 3 iguais)
    let win = false;
    let multiplier = 0;

    if (reel1 === reel2 && reel2 === reel3) {
        win = true;
        // Tabela de Pagamentos
        if (reel1 === 'samurai') multiplier = 500; // Jackpot!
        else if (reel1 === 'robo') multiplier = 100;
        else if (reel1 === 'espada') multiplier = 50;
        else if (reel1 === 'moeda') multiplier = 20;
        else multiplier = 5;
    }

    // 3. Envia resposta para o Frontend desenhar
    res.json({
        reels: [reel1, reel2, reel3],
        win: win,
        multiplier: multiplier
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🗡️  Cyber Samurai rodando na porta ${PORT}`);
});
