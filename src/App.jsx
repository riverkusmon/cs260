import { Navigation, Footer } from './components/Layout';
import { DashboardGrid } from './components/Dashboard';

export default function App() {
    return (
        <>
            <header>
                <Navigation />
            </header>
            <main className="container fade-in">
                <h1>Welcome to the Grant Management System</h1>
                <img src="/images/writing_grant.png" alt="Writing a grant" className="hero-image" />

                <DashboardGrid />

                <section className="card">
                    <h2>About Our System</h2>
                    <p>It's easier than ever to apply for grants using us. Now built with Vite!</p>
                    <button>Learn More</button>
                </section>
            </main>
            <Footer />
        </>
    );
}