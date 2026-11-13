import { Navigate } from 'react-router-dom';

// localStorage එකෙන් logged-in user ව කියවනවා
function readStoredUser() {
  try {
    const storedUserText = localStorage.getItem('gifthub_user');
    return storedUserText ? JSON.parse(storedUserText) : null;
  } catch {
    return null;
  }
}

// requiredRole දුන්නොත් (උදා: "admin") ඒ role එකම ඕනේ
function ProtectedRoute({ children, requiredRole }) {
  const loggedInUser = readStoredUser();

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && loggedInUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
