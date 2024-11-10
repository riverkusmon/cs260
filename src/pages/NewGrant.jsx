import { useState } from 'react';

export default function NewGrant() {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, amount, date, description });
    };

    return (
        <main className="container fade-in">
            <h1>New Grant Application</h1>
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

                <button type="submit">Submit Application</button>
            </form>
        </main>
    );
}