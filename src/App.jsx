import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation, Footer } from './components/Layout';
import Home from './pages/Home';
import PreviousGrants from './pages/PreviousGrants';
import NewGrant from './pages/NewGrant';
import SignIn from './pages/SignIn';
import Register from "./pages/Register.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <>
                <header>
                    <Navigation />
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/previous-grants" element={<PreviousGrants />} />
                    <Route path="/new-grant" element={<NewGrant />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
                <Footer />
            </>
        </BrowserRouter>
    );
}