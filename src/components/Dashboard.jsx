import { useState, useEffect } from 'react';

export function DashboardCard({ title, value }) {
    return (
        <div className="dashboard-card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
}

export function DashboardGrid() {
    const [stats, setStats] = useState({
        totalGrants: 0,
        totalAmount: 0,
        activeGrants: 0,
        successRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        } else {
            return `$${amount.toFixed(2)}`;
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/dashboard/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading stats...</div>;
    if (error) return <div>Error loading stats: {error}</div>;

    return (
        <section className="dashboard-grid">
            <DashboardCard title="Total Grants" value={stats.totalGrants} />
            <DashboardCard title="Total Amount" value={formatCurrency(stats.totalAmount)} />
            <DashboardCard title="Active Grants" value={stats.activeGrants} />
            <DashboardCard title="Success Rate" value={`${stats.successRate}%`} />
        </section>
    );
}