import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import useAuthStore from './stores/authStore'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import PlayerGame from './pages/PlayerGame';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import QuizEditor from './pages/QuizEditor';
import HostGame from './pages/HostGame';
import NotFound from './pages/NotFound';

function ProtectedRoute({children}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

function GuestRoute({children}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Navigate to={"/dashboard"} /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
        <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />
        <Route path='/join' element={<Lobby />} />
        <Route path='/play/:pin' element={<PlayerGame />} />
        <Route path='/results/:pin' element={<Results />} />
        <Route path='*' element={<NotFound />} />

        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='/quiz/new'
          element={
            <ProtectedRoute>
              <QuizEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path='/quiz/:id/edit'
          element={
            <ProtectedRoute>
              <QuizEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path='/host/:pin'
          element={
            <ProtectedRoute>
              <HostGame />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
