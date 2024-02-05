import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const port = 3000;

// Create SQLite database and table
const db = new sqlite3.Database('sensors.db');
db.run('CREATE TABLE IF NOT EXISTS sensor_entries (id INTEGER PRIMARY KEY, name TEXT, value REAL, timestamp INTEGER)');

// Middleware to enable CORS
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// POST endpoint to add sensor entry
app.post('/', (req, res) => {
  const { name, value, timestamp } = req.body;
  db.run('INSERT INTO sensor_entries (name, value, timestamp) VALUES (?, ?, ?)', [name, value, timestamp], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// GET endpoint to get latest value of all names
app.get('/', (req, res) => {
  db.all('SELECT name, MAX(timestamp) AS timestamp, value FROM sensor_entries GROUP BY name', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const data = {};
    rows.forEach((row) => {
        data[row.name] = parseFloat(row.value).toFixed(2);
    })
    res.json(data);
  });
});

// GET endpoint to get data of a specific name with timestamp filtering
app.get('/:name', (req, res) => {
  const { name } = req.params;
  const { page, timestamp } = req.query;
  const pageSize = 10; // Set your desired page size

  const offset = (page - 1) * pageSize;
  const query = 'SELECT * FROM sensor_entries WHERE name = ? AND timestamp <= ? ORDER BY timestamp DESC LIMIT ? OFFSET ?';

  db.all(query, [name, timestamp, pageSize, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
