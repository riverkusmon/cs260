export default function NewGrant() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <main className="container fade-in">
            <h1>New Grant Application</h1>
            <form className="card" onSubmit={handleSubmit}>
                <label htmlFor="grantName">Grant Name</label>
                <input type="text" id="grantName" name="grantName" required />

                <label htmlFor="grantAmount">Grant Amount</label>
                <input type="number" id="grantAmount" name="grantAmount" required />

                <label htmlFor="grantDate">Grant Date</label>
                <input type="date" id="grantDate" name="grantDate" required />

                <label htmlFor="grantDescription">Grant Description</label>
                <textarea id="grantDescription" name="grantDescription" rows="4" required />

                <button type="submit">Submit Application</button>
            </form>
        </main>
    );
}