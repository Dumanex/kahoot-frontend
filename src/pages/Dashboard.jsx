import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";
import { deleteQuiz, getQuizzes } from "../api/quizApi";
import { Link, useNavigate } from "react-router-dom";
import QuizCard from "../components/quiz/QuizCard";
import useGameStore from "../stores/gameStore";
import { createSession } from "../api/gameApi";

function Dashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState('');
    const logout = useAuthStore((state) => state.logout);
    const resetGame = useGameStore((state) => state.reset);
    const navigate = useNavigate();

    const loadQuizzes = async () => {
        try {
            const response = await getQuizzes();
            setQuizzes(response.data.content);
        } catch (err) {
            setError("Neuspešno učitavanje kvizova");
        }
    };

    useEffect(() => {
        loadQuizzes();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Da li sigurno želiš da obrišeš ovaj kviz?")) return;

        try {
            await deleteQuiz(id);
            setQuizzes((prev) => prev.filter((q) => q.id !== id))
        } catch (err) {
            setError("Neuspešno brisanje kviza");
        }
    };

    const handleHost = async (quizId, isPublic) => {
          setError('');
          try {
              const response = await createSession(quizId, isPublic ? 'PUBLIC' : 'PRIVATE');
              resetGame();
              navigate(`/host/${response.data.pinCode}`);
          } catch (err) {
              setError("Neuspešno pokretanje igre");
          }
      };

    return (
        <div>
            <h1>Moji kvizovi</h1>
            <button onClick={logout}>Odjavi se</button>
            <Link to="/quiz/new">Napravi novi kviz</Link>
            <br />
            <Link to="/">Početna</Link>

            {error && <p>{error}</p>}

            {quizzes.length === 0 && <p>Nemaš još nijedan kviz</p>}

            {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onDelete={handleDelete} onHost={handleHost} />
            ))}
        </div>
    );
}

export default Dashboard;