import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [motivationalMessage, setMotivationalMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Sign in failed');
            }

            localStorage.setItem('user', JSON.stringify(data));

            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function getMessage() {
            try {
                const response = await fetch('/api/affirmation');
                if (!response.ok) {
                    throw new Error('Failed to fetch affirmation');
                }
                const data = await response.json();
                setMotivationalMessage(data.affirmation);
            } catch (err) {
                setMotivationalMessage('You got this! ✨');
                console.error('Error fetching affirmation:', err);
            }
        }
        getMessage();
    }, []);

    return (
        <main className="container fade-in">
            <h1>Here&apos;s something to brighten your day!</h1>
            <p>{motivationalMessage}</p>
            <h1>Sign In</h1>
            {error && <div className="error-message">{error}</div>}
            <form className="card" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </main>
    );
}