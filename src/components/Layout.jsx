import {useEffect} from "react";

export function Navigation() {
    return (
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/previous-grants">Previous Grants</a></li>
                <li><a href="/new-grant">New Grant</a></li>
                <li><a href="/sign-in">Sign In</a></li>
            </ul>
        </nav>
    );
}

export function Footer() {
    const [motivationalMessage, setMotivationalMessage] = useState('You are doing great!');
    useEffect(() => {
        async function getMessage() {
            try {
                const response = await fetch('/api/affirmation');
                if (!response.ok) {
                    throw new Error('Failed to fetch affirmation');
                }
                const data = await response.json();
                setMotivationalMessage(data.affirmation);
            } catch (err) {
                setMotivationalMessage('You got this! ✨');
                console.error('Error fetching affirmation:', err);
            }
        }
        getMessage();
    }, []);

    return (
        <footer>
            <p>&copy; 2024 Grant Management System | <a href="https://github.com/riverkusmon/cs260">Andrew's GitHub</a>
            </p>
            <h1>Here&apos;s something to brighten your day!</h1>
            <h5>{motivationalMessage}</h5>
        </footer>
    );
}