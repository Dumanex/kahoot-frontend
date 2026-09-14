import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../stores/authStore";
import PublicGamesList from "../components/game/PublicGamesList";

function Home() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const username = useAuthStore((state) => state.user?.username);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return (
        <div>
        <h1>Kahoot</h1>

        {isAuthenticated ? (
          <div>
            <Link to="/dashboard">Idi na Dashboard</Link>
            <button onClick={handleLogout}>Odjavi se</button>
          </div>
        ) : (
          <div>
            <Link to="/login">Prijavi se</Link>
            <br />
            <Link to="/register">Registruj se</Link>
          </div>
        )}

        <Link to="/join">Pridruži se preko PIN koda</Link>

        <PublicGamesList excludeHostName={username} />
      </div>
    );
}

export default Home