import {useContext, useEffect} from "react";
import {AuthContext} from "./AuthContext.jsx";
import {useNavigate} from "react-router-dom";

function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/sign-in');
        }
    }, [user, navigate]);

    return user ? children : null;
}

export default ProtectedRoute;