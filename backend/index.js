import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PRODUCT = process.env.VITE_PRODUCT_NAME || 'SubLedger';

app.get('/', (req, res) => {
  res.json({ ok: true, product: PRODUCT });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: 'missing text' });
    const key = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY;
    if (!key) return res.status(500).json({ error: 'missing deepseek key' });
    const r = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: text }] })
    });
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`${PRODUCT} backend on ${PORT}`));
