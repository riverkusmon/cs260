import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { MongoClient } from 'mongodb';
import { readFile } from 'fs/promises';
import bcrypt from 'bcrypt';
import OpenAI from 'openai';


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

const openai = new OpenAI({
    apiKey: config.openai
});

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
        console.log('Received raw message:', message.toString());
        try {
            const data = JSON.parse(message);
            console.log('Parsed data:', data);

            if (data.type === 'WRITE_GRANT') {
                console.log('Processing grant writing request:', data.projectIdea);

                try {
                    const stream = await openai.chat.completions.create({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are an experienced grant writer who helps create compelling grant proposals.'
                            },
                            {
                                role: 'user',
                                content: createGrantPrompt(data.projectIdea)
                            }
                        ],
                        stream: true,
                        temperature: 0.7,
                        max_tokens: 2000
                    });

                    let fullResponse = '';
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            fullResponse += content;
                            ws.send(JSON.stringify({
                                type: 'AI_SUGGESTION',
                                suggestion: fullResponse,
                                metadata: {
                                    name: data.details.name,
                                    amount: data.details.requestedAmount,
                                    date: data.details.proposalDate
                                }
                            }));
                        }
                    }

                    ws.send(JSON.stringify({
                        type: 'WRITING_COMPLETE',
                        finalProposal: fullResponse
                    }));

                } catch (error) {
                    console.error('OpenAI API error:', error);
                    ws.send(JSON.stringify({
                        type: 'ERROR',
                        message: 'Error generating grant proposal: ' + error.message
                    }));
                }
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Error processing your message: ' + error.message
            }));
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function createGrantPrompt(description) {
    return `Create a professional grant proposal for the following project: "${description}"

    Please structure the proposal with the following sections, using markdown formatting:

    # Executive Summary

    # Project Description

    # Goals and Objectives

    # Methodology and Implementation

    # Expected Outcomes and Impact

    # Budget Justification

    # Timeline

    # Evaluation Plan

    Important guidelines:
    - Be specific and data-driven where possible
    - Use professional language suitable for grant reviewers
    - Focus on measurable outcomes and impact
    - Keep the total response detailed but concise
    - Use markdown formatting for better readability`;
}

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
    }
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

const port = process.argv.length > 2 ? process.argv[2] : 4000;
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});