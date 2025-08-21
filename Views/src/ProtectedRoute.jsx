import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const username = localStorage.getItem('username');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (username && isLoggedIn === 'true') {
        setIsAuthenticated(true);
      } else {
        // Clear any invalid data
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');
        navigate('/');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute; 