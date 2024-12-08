import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function NewGrant() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        date: '',
        idea: '',
    });
    const [generatedProposal, setGeneratedProposal] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [wsStatus, setWsStatus] = useState('Connecting...');
    const [isWriting, setIsWriting] = useState(false);
    const wsRef = useRef(null);
    const proposalRef = useRef(null);
    const formDataRef = useRef(formData);

    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    useEffect(() => {
        connectWebSocket();
        return () => cleanupWebSocket();
    }, []);

    useEffect(() => {
        console.log(formData, "this is the data");
    }, [formData]);

    const connectWebSocket = () => {
        const ws = new WebSocket('ws://localhost:4000');
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to WebSocket');
            setWsStatus('Connected');
        };

        ws.onmessage = handleWebSocketMessage;

        ws.onerror = () => {
            console.log('WebSocket error - attempting reconnection');
            setWsStatus('Reconnecting...');
            setIsWriting(false);
        };

        ws.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason);
            setWsStatus('Disconnected');
            setIsWriting(false);
            setTimeout(connectWebSocket, 3000);
        };
    };

    const cleanupWebSocket = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.close(1000, 'Component unmounting');
        }
    };

    const submitGrantApplication = async (proposalText) => {
        setSubmitting(true);
        setError(null);
        const currentFormData = formDataRef.current;
        console.log(currentFormData, proposalText, "this is the data for the submission");

        try {
            const response = await fetch('/api/grants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...currentFormData,
                    description: proposalText
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            await response.json();
            navigate('/previous-grants');
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    const handleWebSocketMessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'AI_SUGGESTION':
                    setGeneratedProposal(data.suggestion);
                    if (proposalRef.current) {
                        proposalRef.current.scrollTop = proposalRef.current.scrollHeight;
                    }
                    break;
                case 'WRITING_COMPLETE':
                    setIsWriting(false);
                    submitGrantApplication(data.finalProposal || generatedProposal);
                    break;
                case 'ERROR':
                    setError(data.message);
                    setIsWriting(false);
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            setIsWriting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWriteGrant = () => {
        if (!formData.idea) {
            setError('Please provide your grant idea first');
            return;
        }

        setIsWriting(true);
        setError(null);
        setGeneratedProposal('');
        console.log(formData, "this is the data for the grant inside of the handle write grant");

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message = {
                type: 'WRITE_GRANT',
                projectIdea: formData.idea,
                details: {
                    name: formData.name,
                    requestedAmount: formData.amount,
                    proposalDate: formData.date
                }
            };
            wsRef.current.send(JSON.stringify(message));
        } else {
            setError('Connection to grant writer not available');
            setIsWriting(false);
            connectWebSocket();
        }
    };

    return (
        <main className="container max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">New Grant Application</h1>

            <div className="text-sm">
                AI Grant Writer Status:
                <span className={`ml-2 ${wsStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                    {wsStatus}
                </span>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Grant Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Your project name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                            Requested Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            min="0"
                            placeholder="Funding amount needed"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                            Submission Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idea">
                            Your Project Idea
                        </label>
                        <textarea
                            id="idea"
                            name="idea"
                            rows="4"
                            value={formData.idea}
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Briefly describe your project idea..."
                        />
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleWriteGrant}
                                disabled={isWriting || !formData.idea || submitting}
                                className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                    (isWriting || !formData.idea || submitting) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isWriting ? 'Writing and Submitting Proposal...' : 'Generate and Submit Proposal'}
                            </button>
                        </div>
                    </div>

                    {(isWriting || generatedProposal) && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">
                                Generated Proposal {isWriting && <span className="animate-pulse">...</span>}
                            </h3>
                            <div
                                ref={proposalRef}
                                className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto"
                            >
                                <ReactMarkdown>
                                    {generatedProposal || 'Starting to write...'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}