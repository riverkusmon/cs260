import { useState, useEffect } from 'react';

export default function PreviousGrants() {
    const [grants, setGrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGrants = async () => {
            try {
                const response = await fetch('/api/grants');
                if (!response.ok) {
                    throw new Error('Failed to fetch grants');
                }
                const data = await response.json();
                setGrants(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGrants();
    }, []);

    if (loading) return <main className="container"><div>Loading grants...</div></main>;
    if (error) return <main className="container"><div>Error: {error}</div></main>;

    return (
        <main className="container fade-in">
            <h1>Previous Grants</h1>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Grant Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {grants.map((grant, index) => (
                        <tr key={index}>
                            <td>{grant.name}</td>
                            <td>${grant.amount.toLocaleString()}</td>
                            <td>{new Date(grant.date).toLocaleDateString()}</td>
                            <td>{grant.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}