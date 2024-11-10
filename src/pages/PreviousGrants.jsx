export default function PreviousGrants() {
    const grants = [
        { name: "Community Development Grant", amount: "$50,000", date: "2023-05-15", status: "Approved" },
        { name: "Environmental Research Fund", amount: "$75,000", date: "2023-08-22", status: "In Progress" },
        { name: "Educational Technology Initiative", amount: "$100,000", date: "2024-01-10", status: "Pending" },
        { name: "Public Health Awareness Campaign", amount: "$60,000", date: "2023-11-30", status: "Approved" },
        { name: "Renewable Energy Project", amount: "$120,000", date: "2024-02-28", status: "In Review" },
    ];

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
                            <td>{grant.amount}</td>
                            <td>{grant.date}</td>
                            <td>{grant.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}