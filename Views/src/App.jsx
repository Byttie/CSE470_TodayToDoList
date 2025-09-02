import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './homepage';
import Signup from './signup';
import Dashboard from './dashboard';
import ProtectedRoute from './ProtectedRoute';
import Tasks from './tasks';
import Shop from './shop';
import Social from './social';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute> 
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />
        <Route path="/shop" element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        } />
        <Route path="/social" element={
          <ProtectedRoute>
            <Social />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;