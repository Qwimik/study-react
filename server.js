import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const defaultData = { users: [], news: [], notes: {} };
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
};

const writeData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/users', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const data = await readData();
    const newUser = req.body;
    data.users.push(newUser);
    await writeData(data);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user' });
  }
});

app.put('/api/users/:email', async (req, res) => {
  try {
    const data = await readData();
    const userIndex = data.users.findIndex(u => u.email === req.params.email);
    if (userIndex !== -1) {
      data.users[userIndex] = { ...data.users[userIndex], ...req.body };
      await writeData(data);
      res.json(data.users[userIndex]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.get('/api/users/:email', async (req, res) => {
  try {
    const data = await readData();
    const user = data.users.find(u => u.email === req.params.email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to find user' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read news' });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const data = await readData();
    const newNewsItem = req.body;
    data.news.push(newNewsItem);
    await writeData(data);
    res.json(newNewsItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save news' });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    const data = await readData();
    data.news = data.news.filter(n => n.id !== parseInt(req.params.id));
    await writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

app.get('/api/notes/:email', async (req, res) => {
  try {
    const data = await readData();
    const notes = data.notes[req.params.email] || [];
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

app.post('/api/notes/:email', async (req, res) => {
  try {
    const data = await readData();
    const email = req.params.email;
    if (!data.notes[email]) {
      data.notes[email] = [];
    }
    data.notes[email] = req.body;
    await writeData(data);
    res.json(data.notes[email]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save notes' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

