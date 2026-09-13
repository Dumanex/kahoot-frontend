import { Link } from "react-router-dom";

function QuizCard({quiz, onDelete, onHost}) {
    return (
        <div>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <p>Broj pitanja: {quiz.questions?.length ?? 0}</p>
            <Link to={`/quiz/${quiz.id}/edit`}>Uredi</Link>
            <button onClick={() => onHost(quiz.id)}>Host</button>
            <button onClick={() => onDelete(quiz.id)}>Obriši</button>
        </div>
    );
}

export default QuizCard;