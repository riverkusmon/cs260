import { useState, useEffect } from 'react';

export default function PreviousGrants() {
    const [grants, setGrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGrant, setSelectedGrant] = useState(null);

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

    if (loading) return <main className="container mx-auto p-4"><div className="text-xl">Loading grants...</div></main>;
    if (error) return <main className="container mx-auto p-4"><div className="text-red-500">Error: {error}</div></main>;

    return (
        <main className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Previous Grants</h1>

            {selectedGrant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
                        <button
                            onClick={() => setSelectedGrant(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-4">{selectedGrant.name}</h2>

                        <div className="mb-4">
                            <strong>Amount:</strong> ${selectedGrant.amount.toLocaleString()}<br />
                            <strong>Submission Date:</strong> {new Date(selectedGrant.date).toLocaleDateString()}<br />
                            <strong>Status:</strong> {selectedGrant.status}
                        </div>

                        <div className="border-t pt-4 whitespace-pre-wrap">
                            {selectedGrant.description || 'No proposal description available.'}
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grant Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {grants.map((grant, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{grant.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${grant.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(grant.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${grant.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        grant.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'}`}>
                                        {grant.status}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => setSelectedGrant(grant)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    View Proposal
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}