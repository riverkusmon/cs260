export default function SignIn() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <main className="container fade-in">
            <h1>Sign In</h1>
            <form className="card" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />

                <button type="submit">Sign In</button>
            </form>
        </main>
    );
}