import { useState } from "react";
import { Save, X, Plus, Timer as TimerIcon, Image, Music, CircleAlert } from "lucide-react";
import { addQuestion, updateQuestion, uploadMedia } from "../../api/quizApi";
import { translateErrorResponse } from "../../utils/errorMessages";
import AnswerEditor from "./AnswerEditor";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

const QUESTION_TYPES = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'IMAGE_RECOGNITION', 'AUDIO'];
const SYMBOLS = ['TRIANGLE', 'DIAMOND', 'CIRCLE', 'SQUARE'];
const COLORS = ['RED', 'BLUE', 'YELLOW', 'GREEN'];

function emptyAnswers(count) {
    return Array.from({ length: count }, (_, i) => ({
      answerText: '',
      isCorrect: i === 0
    }));
}

function QuestionEditor({quizId, question, orderIndex, onSaved, onCancel}) {
    const [questionType, setQuestionType] = useState(question?.questionType || 'MULTIPLE_CHOICE');
    const [questionText, setQuestionText] = useState(question?.questionText || '');
    const [timeLimitSeconds, setTimeLimitSeconds] = useState(question?.timeLimitSeconds || 20);
    const [imageUrl, setImageUrl] = useState(question?.imageUrl || '');
    const [audioUrl, setAudioUrl] = useState(question?.audioUrl || '');
    const [answers, setAnswers] = useState(question?.answers?.map((a) => ({ id: a.id, answerText: a.answerText, isCorrect: a.isCorrect })) || emptyAnswers(2));
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleTypeChange = (newType) => {
      setQuestionType(newType);
      if (newType === 'TRUE_FALSE') {
        setAnswers([
          { answerText: 'Tačno', isCorrect: true },
          { answerText: 'Netačno', isCorrect: false }
        ]);
      }
    };

    const handleTextChange = (index, text) => {
      setAnswers((prev) => prev.map((a, i) => (i === index ? { ...a, answerText: text } : a)));
    };

    const handleMarkCorrect = (index) => {
      setAnswers((prev) => prev.map((a, i) => ({ ...a, isCorrect: i === index })));
    };

    const handleAddAnswer = () => {
      if (answers.length >= 4) return;
      setAnswers((prev) => [...prev, { answerText: '', isCorrect: false }]);
    };

    const handleRemoveAnswer = (index) => {
      if (answers.length <= 2) return;
      setAnswers((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const res = await uploadMedia(file, type);
            if (type === 'image') {
                setImageUrl(res.data.url);
            } else {
                setAudioUrl(res.data.url);
                const audio = new Audio(res.data.url);
                audio.addEventListener('loadedmetadata', () => {
                    if (Number.isFinite(audio.duration)) {
                        setTimeLimitSeconds(Math.ceil(audio.duration));
                    }
                });
            }
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
            e.target.value = '';
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = {
            questionType,
            questionText,
            timeLimitSeconds: Number(timeLimitSeconds),
            imageUrl: imageUrl || undefined,
            audioUrl: audioUrl || undefined,
            orderIndex,
            answers: answers.map((a, i) => ({
                id: a.id || undefined,
                answerText: a.answerText,
                isCorrect: a.isCorrect,
                orderIndex: i,
                symbol: SYMBOLS[i],
                color: COLORS[i]
            }))
        };

        try {
            if (question) {
                await updateQuestion(question.id, payload);
            } else {
                await addQuestion(quizId, payload);
            }

            onSaved();
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select
                    value={questionType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="rounded-md border border-line bg-stone px-3 py-2 text-ink focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss"
                >
                    {QUESTION_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <Input
                    placeholder="Tekst pitanja"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />

                <Input
                    type="number"
                    icon={TimerIcon}
                    placeholder="Vreme (sekunde)"
                    value={timeLimitSeconds}
                    onChange={(e) => setTimeLimitSeconds(e.target.value)}
                    min="1"
                    required
                />

                {questionType === 'IMAGE_RECOGNITION' && (
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'image')}
                            disabled={uploading}
                            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-mist file:px-3 file:py-2 file:text-ink"
                        />
                        {imageUrl && (
                            <Card className="flex items-center gap-3">
                                <Image size={18} className="text-ink/50" />
                                <img src={imageUrl} alt="" width="120" className="rounded-md border border-line" />
                                <Button variant="ghost" size="md" icon={X} type="button" onClick={() => setImageUrl('')}>Ukloni</Button>
                            </Card>
                        )}
                    </div>
                )}

                {questionType === 'AUDIO' && (
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileUpload(e, 'audio')}
                            disabled={uploading}
                            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-mist file:px-3 file:py-2 file:text-ink"
                        />
                        {audioUrl && (
                            <Card className="flex items-center gap-3">
                                <Music size={18} className="text-ink/50" />
                                <audio src={audioUrl} controls />
                                <Button variant="ghost" size="md" icon={X} type="button" onClick={() => setAudioUrl('')}>Ukloni</Button>
                            </Card>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {answers.map((answer, index) => (
                        <AnswerEditor
                            key={index}
                            answer={answer}
                            index={index}
                            onTextChange={handleTextChange}
                            onMarkCorrect={handleMarkCorrect}
                            onRemove={handleRemoveAnswer}
                            canRemove={questionType !== 'TRUE_FALSE' && answers.length > 2}
                        />
                    ))}
                </div>

                {questionType !== 'TRUE_FALSE' && answers.length < 4 && (
                    <Button
                        type="button"
                        variant="secondary"
                        icon={Plus}
                        className="border-dashed border-2"
                        onClick={handleAddAnswer}
                    >
                        Dodaj odgovor
                    </Button>
                )}

                {error && (
                    <p className="flex items-center gap-2 text-sm text-rust">
                        <CircleAlert size={16} />
                        {error}
                    </p>
                )}

                {uploading && (
                    <p className="flex items-center gap-2 text-sm text-ink/60">
                        <Spinner size={16} />
                        Otpremanje u toku...
                    </p>
                )}

                <div className="flex gap-3">
                    <Button type="submit" icon={Save} disabled={uploading}>Sačuvaj pitanje</Button>
                    <Button type="button" variant="secondary" icon={X} onClick={onCancel}>Otkaži</Button>
                </div>
            </form>
        </Card>
    );
}

export default QuestionEditor;
