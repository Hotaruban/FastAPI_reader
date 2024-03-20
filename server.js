const express = require('express');
const path = require('path');

const app = express();

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '.')));

// Route GET pour l'API
app.get('/api/data', (req, res) => {
    // Récupérez vos données ici, puis renvoyez-les
    res.json({ data: 'data' });
});

// Route POST pour l'API
app.post('/api/data', express.json(), (req, res) => {
    // Accédez aux données envoyées avec la requête
    const data = req.body;
    // Faites quelque chose avec les données ici, puis renvoyez une réponse
    res.json({ success: true });
});

// Démarrer le serveur
const port = 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
