import { useState } from "react";
import { addQuestion, updateQuestion, uploadMedia } from "../../api/quizApi";
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
                <div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploading} />
                    {imageUrl && (
                        <div>
                            <img src={imageUrl} alt="" width="200" />
                            <button type="button" onClick={() => setImageUrl('')}>Ukloni</button>
                        </div>
                    )}
                </div>
            )}

            {questionType === 'AUDIO' && (
                <div>
                    <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, 'audio')} disabled={uploading} />
                    {audioUrl && (
                        <div>
                            <audio src={audioUrl} controls />
                            <button type="button" onClick={() => setAudioUrl('')}>Ukloni</button>
                        </div>
                    )}
                </div>
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

            {uploading && <p>Otpremanje u toku...</p>}
  
            <button type="submit" disabled={uploading}>Sačuvaj pitanje</button>
            <button type="button" onClick={onCancel}>Otkaži</button>
        </form>
    );
}

export default QuestionEditor;