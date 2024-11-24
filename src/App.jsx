import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation, Footer } from './components/Layout';
import Home from './pages/Home';
import PreviousGrants from './pages/PreviousGrants';
import NewGrant from './pages/NewGrant';
import SignIn from './pages/SignIn';
import Register from "./pages/Register.jsx";
import {AuthProvider} from "./components/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <>
                    <header>
                        <Navigation />
                    </header>
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />
                        <Route path="/previous-grants" element={
                            <ProtectedRoute>
                                <PreviousGrants />
                            </ProtectedRoute>
                        } />
                        <Route path="/new-grant" element={
                            <ProtectedRoute>
                                <NewGrant />
                            </ProtectedRoute>
                        } />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                    <Footer />
                </>
            </BrowserRouter>
        </AuthProvider>
    );
}