// Configures Express app, middleware, and routes
const express = require('express');
const app = express();

// --- Importar Módulos ---
const forgeRoutes = require('./src/routes/forgeRoutes');
const errorHandler = require('./src/middleware/errorHandler'); // Importa o middleware de tratamento de erros
const logger = require('./src/middleware/logger');  

const path = require('path');// Importa o middleware de log/tempo de resposta

// --- Middlewares Gerais ---

app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar payloads JSON
app.use(express.json());

// Middleware de Log/Tempo de Resposta
app.use(logger);


// --- Definição de Rotas Gerais ---

// Rotas do seu app.js original
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(express.static('public'));

app.get('/health', (req, res) => {
    res.json({ status: 'active', timestamp: new Date().toISOString() });
});

app.get('/time', (req, res) => {
    res.send(new Date().toISOString());
});

app.get('/echo', (req, res) => {
    const { category, color } = req.query;
    if (!category && !color) {
        throw new Error('category or color are required');
    } else {
        res.json({ ok: true, category: category, color: color });
    }
});

app.get('/error-route', (req, res) => {
    throw new Error('Something went wrong!');
});

// Função auxiliar para rota /external
async function fetchPost(userId, limit) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_limit=${limit}`);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Failed to fetch posts');
    }
}

app.get('/external', async (req, res) => {
    const { userId = 1, limit = 5 } = req.query;

    const posts = await fetchPost(userId, limit);
    res.json({ ok: true, data: posts, params: { userId, limit } });
});

// Rota para obter o token
app.get('/auth/token', async (req, res) => {
  try {
    const response = await fetch(process.env.FORGE_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.FORGE_CLIENT_ID,
        client_secret: process.env.FORGE_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'data:read data:write bucket:create bucket:read'
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro ao obter token:', error);
    res.status(500).json({ error: 'Erro ao obter token' });
  }
});

app.get('/api/airtable', async (req, res) => {
  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;
  
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
    });

    const text = await response.text(); // <- log the raw response
    console.log(text);

    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.post("/api/add", async (req, res) => {
  const fields = req.body; // objeto com os campos do registro
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fields })
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  const recordId = req.params.id;

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}/${recordId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        }
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Rota /hubs
app.get('/hubs', (req, res) => {
  res.status(200).send();
});

// --- Montagem das Rotas Específicas ---

// Monta as rotas da API Forge/Autodesk
app.use(forgeRoutes);

// --- Global Error Middleware ---

// Garante que captura erros de todas as rotas e middlewares anteriores
app.use(errorHandler);


module.exports = app;