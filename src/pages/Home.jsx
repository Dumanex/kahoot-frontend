import { useNavigate } from "react-router-dom"
import { LayoutDashboard, LogOut, LogIn, UserPlus, KeyRound } from "lucide-react";
import useAuthStore from "../stores/authStore";
import PublicGamesList from "../components/game/PublicGamesList";
import PageShell from "../components/layout/PageShell";
import Button from "../components/ui/Button";

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
        <PageShell>
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="font-display text-4xl">Kahoot</h1>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <>
                <Button to="/dashboard" variant="secondary" icon={LayoutDashboard}>Idi na Dashboard</Button>
                <Button variant="ghost" icon={LogOut} onClick={handleLogout}>Odjavi se</Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="secondary" icon={LogIn}>Prijavi se</Button>
                <Button to="/register" variant="secondary" icon={UserPlus}>Registruj se</Button>
              </>
            )}
          </div>

          <Button to="/join" size="lg" icon={KeyRound}>Pridruži se preko PIN koda</Button>

          <div className="w-full max-w-2xl text-left">
            <PublicGamesList excludeHostName={username} />
          </div>
        </div>
      </PageShell>
    );
}

export default Home
