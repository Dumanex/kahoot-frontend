import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Home as HomeIcon, LogOut, FileQuestion, CircleAlert } from "lucide-react";
import useAuthStore from "../stores/authStore";
import { deleteQuiz, getQuizzes } from "../api/quizApi";
import QuizCard from "../components/quiz/QuizCard";
import useGameStore from "../stores/gameStore";
import { createSession, getMyGames } from "../api/gameApi";
import { ActiveGames, GameHistory } from "../components/game/HostGames";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

function Dashboard() {
    const location = useLocation();
    const [quizzes, setQuizzes] = useState([]);
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');
    const [gamesError, setGamesError] = useState('');
    const [modalError, setModalError] = useState(location.state?.modalError || '');
    const [hosting, setHosting] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    const resetGame = useGameStore((state) => state.reset);
    const navigate = useNavigate();

    useEffect(() => {
        getQuizzes()
            .then((response) => setQuizzes(response.data.content))
            .catch(() => setError("Neuspešno učitavanje kvizova"));

        getMyGames()
            .then((response) => setGames(response.data))
            .catch(() => setGamesError("Neuspešno učitavanje partija"));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Da li sigurno želiš da obrišeš ovaj kviz?")) return;

        try {
            await deleteQuiz(id);
            setQuizzes((prev) => prev.filter((q) => q.id !== id))
        } catch {
            setError("Neuspešno brisanje kviza");
        }
    };

    const handleHost = async (quizId, isPublic) => {
          setError('');
          setHosting(true);
          try {
              const response = await createSession(quizId, isPublic ? 'PUBLIC' : 'PRIVATE');
              resetGame();
              navigate(`/host/${response.data.pinCode}`);
          } catch {
              setError("Neuspešno pokretanje igre");
              setHosting(false);
          }
      };

    return (
        <PageShell>
            <Modal open={!!modalError} onClose={() => setModalError('')}>
                {modalError}
            </Modal>

            <div className="mb-6 flex items-center justify-between">
                <h1 className="font-display text-2xl">Dashboard</h1>
                <Button variant="ghost" icon={LogOut} onClick={logout}>Odjavi se</Button>
            </div>

            <div className="mb-6 flex gap-3">
                <Button to="/quiz/new" icon={Plus}>Napravi novi kviz</Button>
                <Button to="/" variant="secondary" icon={HomeIcon}>Početna</Button>
            </div>

            {gamesError && (
                <p className="mb-4 flex items-center gap-2 text-sm text-rust">
                    <CircleAlert size={16} />
                    {gamesError}
                </p>
            )}

            <ActiveGames games={games.filter((game) => game.status !== 'COMPLETED')} />

            <h2 className="mb-4 text-lg font-semibold">Moji kvizovi</h2>

            {error && (
                <p className="mb-4 flex items-center gap-2 text-sm text-rust">
                    <CircleAlert size={16} />
                    {error}
                </p>
            )}

            {quizzes.length === 0 ? (
                <Card className="flex items-center gap-2 text-ink/50">
                    <FileQuestion size={18} />
                    <span>Nemaš još nijedan kviz</span>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} onDelete={handleDelete} onHost={handleHost} hostDisabled={hosting} />
                    ))}
                </div>
            )}

            <GameHistory games={games.filter((game) => game.status === 'COMPLETED')} />
        </PageShell>
    );
}

export default Dashboard;
