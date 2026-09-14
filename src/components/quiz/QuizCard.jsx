import { useState } from "react";
import { Link } from "react-router-dom";

function QuizCard({quiz, onDelete, onHost}) {
    const [isPublic, setIsPublic] = useState(false);

    return (
      <div>
        <h3>{quiz.title}</h3>
        <p>{quiz.description}</p>
        <p>Broj pitanja: {quiz.questions?.length ?? 0}</p>
        <Link to={`/quiz/${quiz.id}/edit`}>Uredi</Link>
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Javna partija
        </label>
        <button onClick={() => onHost(quiz.id, isPublic)}>Host</button>
        <button onClick={() => onDelete(quiz.id)}>Obriši</button>
      </div>
    );
}

export default QuizCard;