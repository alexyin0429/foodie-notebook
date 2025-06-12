import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        // Redirect to sign in if not authenticated
        return <Navigate to="/signin" />;
    }

    return children;
}

export default ProtectedRoute; 