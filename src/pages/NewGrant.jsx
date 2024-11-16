import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewGrant() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/grants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    amount,
                    date,
                    description
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit grant');
            }

            await response.json();
            navigate('/previous-grants');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="container fade-in">
            <h1>New Grant Application</h1>
            {error && <div className="error-message">{error}</div>}
            <form className="card" onSubmit={handleSubmit}>
                <label htmlFor="grantName">Grant Name</label>
                <input
                    type="text"
                    id="grantName"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />

                <label htmlFor="grantAmount">Grant Amount</label>
                <input
                    type="number"
                    id="grantAmount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                />

                <label htmlFor="grantDate">Grant Date</label>
                <input
                    type="date"
                    id="grantDate"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                />

                <label htmlFor="grantDescription">Grant Description</label>
                <textarea
                    id="grantDescription"
                    rows="4"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </main>
    );
}