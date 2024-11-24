import express from 'express';
import { MongoClient } from 'mongodb';
import config from './dbConfig.json';

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('grantDB');
const grantsCollection = db.collection('grants');
const usersCollection = db.collection('users');

try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('MongoDB connection error:', error);
}

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;


let grants = [
    { name: "Community Development Grant", amount: 50000, date: "2023-05-15", status: "Approved" },
    { name: "Environmental Research Fund", amount: 75000, date: "2023-08-22", status: "In Progress" },
    { name: "Educational Technology Initiative", amount: 100000, date: "2024-01-10", status: "Pending" }
];

let users = [];

app.use(express.json());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/signin', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        res.json({ success: true, username });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

apiRouter.get('/dashboard/stats', (_req, res) => {
    const stats = {
        totalGrants: grants.length,
        totalAmount: grants.reduce((sum, grant) => sum + grant.amount, 0),
        activeGrants: grants.filter(g => g.status === "In Progress").length,
        successRate: Math.round((grants.filter(g => g.status === "Approved").length / grants.length) * 100)
    };
    res.json(stats);
});

apiRouter.get('/grants', (_req, res) => {
    res.json(grants);
});

apiRouter.post('/grants', (req, res) => {
    const { name, amount, date, description } = req.body;
    const newGrant = {
        name,
        amount: Number(amount),
        date,
        description,
        status: "Pending"
    };
    grants.push(newGrant);
    res.json(newGrant);
});

apiRouter.get('/grants/:id', (req, res) => {
    const grant = grants[req.params.id];
    if (grant) {
        res.json(grant);
    } else {
        res.status(404).json({ message: 'Grant not found' });
    }
});

apiRouter.put('/grants/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (grants[id]) {
        grants[id] = { ...grants[id], status };
        res.json(grants[id]);
    } else {
        res.status(404).json({ message: 'Grant not found' });
    }
});

apiRouter.get('/affirmation', async (_req, res) => {
    try {
        const response = await fetch('https://www.affirmations.dev/');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch affirmation', error: error.message });
    }
});

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});