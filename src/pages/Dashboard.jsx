import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";
import { deleteQuiz, getQuizzes } from "../api/quizApi";
import { Link } from "react-router-dom";
import QuizCard from "../components/quiz/QuizCard";

function Dashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState('');
    const logout = useAuthStore((state) => state.logout);

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

    return (
        <div>
            <h1>Moji kvizovi</h1>
            <button onClick={logout}>Odjavi se</button>
            <Link to="/quiz/new">Napravi novi kviz</Link>

            {error && <p>{error}</p>}

            {quizzes.length === 0 && <p>Nemaš još nijedan kviz</p>}

            {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onDelete={handleDelete} />
            ))}
        </div>
    );
}

export default Dashboard;