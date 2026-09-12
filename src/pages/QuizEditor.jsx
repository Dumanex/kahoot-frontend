import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, createQuiz, updateQuiz, deleteQuestion } from '../api/quizApi';
import { translateErrorResponse } from '../utils/errorMessages';
import QuestionEditor from '../components/quiz/QuestionEditor';

function QuizEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timePerQuestion, setTimePerQuestion] = useState(20);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const [editingQuestion, setEditingQuestion] = useState(null);

    const loadQuiz = async () => {
      try {
        const response = await getQuiz(id);
        setTitle(response.data.title);
        setDescription(response.data.description || '');
        setTimePerQuestion(response.data.timePerQuestion);
        setQuestions(response.data.questions || []);
      } catch (err) {
        setError(translateErrorResponse(err.response?.data));
      }
    };

    useEffect(() => {
      if (!isNew) {
        loadQuiz();
      }
    }, [id]);

    const handleSaveQuiz = async (e) => {
      e.preventDefault();
      setError('');
  
      const payload = { title, description, timePerQuestion: Number(timePerQuestion) };
  
      try {
        if (isNew) {
          const response = await createQuiz(payload);
          navigate(`/quiz/${response.data.id}/edit`);
        } else {
          await updateQuiz(id, payload);
        }
      } catch (err) {
        setError(translateErrorResponse(err.response?.data));
      }
    };

    const handleDeleteQuestion = async (questionId) => {
      if (!window.confirm('Da li sigurno želiš da obrišeš ovo pitanje?')) return;
  
      try {
        await deleteQuestion(questionId);
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      } catch (err) {
        setError(translateErrorResponse(err.response?.data));
      }
    };

    const handleQuestionSaved = () => {
      setEditingQuestion(null);
      loadQuiz();
    };

    return (
        <div>
            <h1>{isNew ? 'Novi kviz' : 'Uredi kviz'}</h1>

            <form onSubmit={handleSaveQuiz}>
                <input 
                    type="text"
                    placeholder='Naslov kviza'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder='Opis (opciono)'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type='number'
                    placeholder='Vreme po pitanju (sekunde)'
                    value={timePerQuestion}
                    onChange={(e) => setTimePerQuestion(e.target.value)}
                    min="1"
                    required
                />

                <button type='submit'>Sačuvaj kviz</button>
            </form>

            {error && <p>{error}</p>}

            {isNew && <p>Sačuvaj kviz da bi mogao da dodaješ pitaja</p>}

            {!isNew && (
                <div>
                    <h2>Pitanja</h2>

                    {questions.map((q) => (
                    editingQuestion === q ? (
                        <QuestionEditor
                        key={q.id}
                        quizId={id}
                        question={q}
                        orderIndex={q.orderIndex}
                        onSaved={handleQuestionSaved}
                        onCancel={() => setEditingQuestion(null)}
                        />
                    ) : (
                        <div key={q.id}>
                        <p>{q.orderIndex + 1}. {q.questionText} ({q.questionType})</p>
                        <button onClick={() => setEditingQuestion(q)}>Uredi</button>
                        <button onClick={() => handleDeleteQuestion(q.id)}>Obriši</button>
                        </div>
                    )
                    ))}

                    {editingQuestion === 'new' ? (
                    <QuestionEditor
                        quizId={id}
                        question={null}
                        orderIndex={questions.length}
                        onSaved={handleQuestionSaved}
                        onCancel={() => setEditingQuestion(null)}
                    />
                    ) : (
                    <button onClick={() => setEditingQuestion('new')}>Dodaj pitanje</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default QuizEditor;