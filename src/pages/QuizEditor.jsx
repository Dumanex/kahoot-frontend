import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Plus, Pencil, Trash2, Timer as TimerIcon, CircleAlert } from 'lucide-react';
import { getQuiz, createQuiz, updateQuiz, deleteQuestion } from '../api/quizApi';
import { translateErrorResponse, isNotQuizCreatorError } from '../utils/errorMessages';
import QuestionEditor from '../components/quiz/QuestionEditor';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

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
    const [deleteError, setDeleteError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (!id) return;

      getQuiz(id)
        .then((response) => {
            setTitle(response.data.title);
            setDescription(response.data.description || '');
            setTimePerQuestion(response.data.timePerQuestion);
            setQuestions(response.data.questions || []);
        })
        .catch((err) => {
            const data = err.response?.data;

            if (isNotQuizCreatorError(data?.message)) {
                navigate('/dashboard', { replace: true, state: { modalError: translateErrorResponse(data) } });
                return;
            }

            setError(translateErrorResponse(data));
        });
    }, [id, navigate]);

    const handleSaveQuiz = async (e) => {
      e.preventDefault();
      setError('');

      const payload = { title, description, timePerQuestion: Number(timePerQuestion) };

      setSubmitting(true);

      try {
        if (isNew) {
          const response = await createQuiz(payload);
          navigate(`/quiz/${response.data.id}/edit`);
        } else {
          await updateQuiz(id, payload);
        }
      } catch (err) {
        setError(translateErrorResponse(err.response?.data));
      } finally {
        setSubmitting(false);
      }
    };

    const handleDeleteQuestion = async (questionId) => {
      if (!window.confirm('Da li sigurno želiš da obrišeš ovo pitanje?')) return;

      setDeleteError(null);

      try {
        await deleteQuestion(questionId);
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      } catch (err) {
        setDeleteError({ questionId, message: translateErrorResponse(err.response?.data) });
      }
    };

    const handleQuestionSaved = async () => {
      setEditingQuestion(null);

      try {
        const response = await getQuiz(id);
        setQuestions(response.data.questions || []);
      } catch (err) {
        setError(translateErrorResponse(err.response?.data));
      }
    };

    return (
        <PageShell>
            <h1 className="mb-6 font-display text-2xl">{isNew ? 'Novi kviz' : 'Uredi kviz'}</h1>

            <Card>
                <form onSubmit={handleSaveQuiz} className="flex flex-col gap-4">
                    <Input
                        placeholder='Naslov kviza'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <Textarea
                        placeholder='Opis (opciono)'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Input
                        type='number'
                        icon={TimerIcon}
                        placeholder='Vreme po pitanju (sekunde)'
                        value={timePerQuestion}
                        onChange={(e) => setTimePerQuestion(e.target.value)}
                        min="1"
                        step="1"
                        required
                    />

                    <Button type='submit' icon={Save} className="self-start" disabled={submitting}>Sačuvaj kviz</Button>
                </form>
            </Card>

            {error && (
                <p className="mt-4 flex items-center gap-2 text-sm text-rust">
                    <CircleAlert size={16} />
                    {error}
                </p>
            )}

            {isNew && <p className="mt-4 text-sm text-ink/60">Sačuvaj kviz da bi mogao da dodaješ pitanja</p>}

            {!isNew && (
                <div className="mt-8">
                    <div className="mb-4 flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Pitanja</h2>
                        <Badge>{questions.length}</Badge>
                    </div>

                    <div className="flex flex-col gap-3">
                        {questions.map((q, index) => (
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
                            <Card key={q.id} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Badge>{index + 1}</Badge>
                                        <span>{q.questionText}</span>
                                        <Badge tone="neutral">{q.questionType}</Badge>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Button variant="ghost" icon={Pencil} onClick={() => setEditingQuestion(q)}>Uredi</Button>
                                        <Button variant="danger" icon={Trash2} onClick={() => handleDeleteQuestion(q.id)}>Obriši</Button>
                                    </div>
                                </div>

                                {deleteError?.questionId === q.id && (
                                    <p className="flex items-center gap-2 text-sm text-rust">
                                        <CircleAlert size={16} />
                                        {deleteError.message}
                                    </p>
                                )}
                            </Card>
                        )
                        ))}

                        {editingQuestion === 'new' ? (
                        <QuestionEditor
                            quizId={id}
                            question={null}
                            orderIndex={questions.reduce((max, q) => Math.max(max, q.orderIndex + 1), 0)}
                            onSaved={handleQuestionSaved}
                            onCancel={() => setEditingQuestion(null)}
                        />
                        ) : (
                        <Button
                            variant="secondary"
                            icon={Plus}
                            className="w-full justify-center border-dashed border-2 py-4"
                            onClick={() => setEditingQuestion('new')}
                        >
                            Dodaj pitanje
                        </Button>
                        )}
                    </div>
                </div>
            )}
        </PageShell>
    );
}

export default QuizEditor;
