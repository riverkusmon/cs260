import express from 'express';
import { MongoClient } from 'mongodb';
import { readFile } from 'fs/promises';
import bcrypt from 'bcrypt';

const config = JSON.parse(
    await readFile(new URL('./dbConfig.json', import.meta.url))
);

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url, { tls: true, serverSelectionTimeoutMS: 3000, autoSelectFamily: false, });
const db = client.db('grantDB');
const grantsCollection = db.collection('grants');
const usersCollection = db.collection('users');

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to MongoDB');
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

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

apiRouter.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, password: hashedPassword });
        res.json({ success: true, username });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

apiRouter.post('/auth/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        res.json({ success: true, username });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

apiRouter.get('/grants', async (_req, res) => {
    try {
        const grants = await grantsCollection.find({}).toArray();
        res.json(grants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

apiRouter.post('/grants', async (req, res) => {
    const {name, amount, date, description} = req.body;
    try {
        const newGrant = {
            name,
            amount: Number(amount),
            date,
            description,
            status: "Pending"
        };
        const result = await grantsCollection.insertOne(newGrant);
        res.json(newGrant);
    } catch (error) {
        res.status(500).json({message: error.message});
    }});

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