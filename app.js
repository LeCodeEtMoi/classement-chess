const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const ChessWebAPI = require('chess-web-api');
const chessAPI = new ChessWebAPI();

app.use(express.static(path.join(__dirname, 'public'))); // sert index.html

app.get('/joueur/:pseudo', async (req, res) => {
    try {
        const profil = await chessAPI.getPlayer(req.params.pseudo);
        res.json(profil.body);
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération du profil' });
    }
});
app.get('/stats/:pseudo', async (req, res) => {
    try {
        const stats = await chessAPI.getPlayerStats(req.params.pseudo);
        res.json(stats.body);
    } catch (err) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération des stats' });
    }
});


app.listen(port, () => {
    console.log(`Serveur lancé : http://localhost:${port}`);
});
