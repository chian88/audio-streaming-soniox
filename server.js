import express from 'express';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3005;
const API_KEY = process.env.SONIOX_API_KEY;

app.use(express.static(__dirname));

app.get('/api/temporary-key', async (req, res) => {
  try {
    const resp = await fetch('https://api.soniox.com/v1/auth/temporary-api-key', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usage_type: 'transcribe_websocket',
        expires_in_seconds: 60,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json();
      return res.status(resp.status).json({ error: err });
    }

    const data = await resp.json();
    res.json({ api_key: data.api_key });
  } catch (error) {
    console.error('Failed to obtain temporary API key:', error);
    res.status(500).json({ error: 'Failed to obtain temporary API key' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
