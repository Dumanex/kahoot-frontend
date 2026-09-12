import { useState } from "react";
import { addQuestion, updateQuestion } from "../../api/quizApi";
import { translateErrorResponse } from "../../utils/errorMessages";
import AnswerEditor from "./AnswerEditor";

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
    const [answers, setAnswers] = useState(question?.answers?.map((a) => ({ answerText: a.answerText, isCorrect: a.isCorrect })) || emptyAnswers(2));
    const [error, setError] = useState('');

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
        <form onSubmit={handleSubmit}>
            <select value={questionType} onChange={(e) => handleTypeChange(e.target.value)}>
                {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Tekst pitanja"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
            />
  
            <input
                type="number"
                placeholder="Vreme (sekunde)"
                value={timeLimitSeconds}
                onChange={(e) => setTimeLimitSeconds(e.target.value)}
                min="1"
                required
            />
    
            {questionType === 'IMAGE_RECOGNITION' && (
                <input
                    type="text"
                    placeholder="URL slike"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            )}

            {questionType === 'AUDIO' && (
                <input
                    type="text"
                    placeholder="URL audio zapisa"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                />
            )}
    
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
    
            {questionType !== 'TRUE_FALSE' && answers.length < 4 && (
                <button type="button" onClick={handleAddAnswer}>Dodaj odgovor</button>
            )}
            
            {error && <p>{error}</p>}
  
            <button type="submit">Sačuvaj pitanje</button>
            <button type="button" onClick={onCancel}>Otkaži</button>
        </form>
    );
}

export default QuestionEditor;