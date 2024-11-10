export function DashboardCard({ title, value }) {
    return (
        <div className="dashboard-card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
}

export function DashboardGrid() {
    return (
        <section className="dashboard-grid">
            <DashboardCard title="Total Grants" value="24" />
            <DashboardCard title="Total Amount" value="$1.2M" />
            <DashboardCard title="Active Grants" value="12" />
            <DashboardCard title="Success Rate" value="78%" />
        </section>
    );
}
