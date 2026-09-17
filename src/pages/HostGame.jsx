import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSession, startGame, nextQuestion, endGame } from "../api/gameApi";
import { translateErrorResponse } from "../utils/errorMessages";
import useGameStore from "../stores/gameStore";
import { useGameConnection } from "../hooks/useGameConnection";
import { useQuestionPhase } from "../hooks/useQuestionPhase";
import QuestionDisplay from "../components/game/QuestionDisplay";
import QuestionStats from "../components/game/QuestionStats";
import Podium from "../components/game/Podium";
import Timer from "../components/common/Timer";

function HostGame() {
    const { pin } = useParams();
    const [quizTitle, setQuizTitle] = useState('');
    const [error, setError] = useState('');

    const players = useGameStore((state) => state.players);
    const status = useGameStore((state) => state.status);
    const currentQuestion = useGameStore((state) => state.currentQuestion);
    const answeredCount = useGameStore((state) => state.answeredCount);
    const leaderboard = useGameStore((state) => state.leaderboard);
    const roundResults = useGameStore((state) => state.roundResults);

    const { finalizeQuestion } = useGameConnection(pin, { isHost: true });
    const phase = useQuestionPhase();

    useEffect(() => {
        getSession(pin).then((response) => setQuizTitle(response.data.quizTitle));
    }, [pin]);

    useEffect(() => {
        if (phase === 'stats' && currentQuestion) {
            finalizeQuestion();
        }
    }, [phase, currentQuestion?.id]);

    const handleStart = async () => {
        setError('');
        try {
            await startGame(pin);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        }
    };

    const handleNext = async () => {
        setError('');
        try {
            await nextQuestion(pin);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        }
    };

    const handleEnd = async () => {
        setError('');
        try {
            await endGame(pin);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
        }
    };

    if (status === 'results') {
        return (
            <div>
                <h1>Igra je završena</h1>
                <Podium leaderboard={leaderboard} />
                <Link to={`/results/${pin}`}>Pogledaj ceo leaderboard</Link>
            </div>
        );
    }

    if (status !== 'playing') {
        return (
            <div>
                <h1>{quizTitle}</h1>
                <h2>PIN: {pin}</h2>
                {error && <p>{error}</p>}
                <h3>Igrači ({players.length}):</h3>
                <ul>
                    {players.map((p) => (
                        <li key={p.id}>{p.nickname}</li>
                    ))}
                </ul>
                <button onClick={handleStart} disabled={players.length === 0}>Počni igru</button>
            </div>
        );
    }

    return (
        <div>
            {error && <p>{error}</p>}
            {currentQuestion && <QuestionDisplay question={currentQuestion} phase={phase} />}

            {phase === "answering" && currentQuestion && (
                <Timer seconds={currentQuestion.timeLimitSeconds} />
            )}

            {currentQuestion && phase === 'stats' ? (
                <QuestionStats roundResults={roundResults} answers={currentQuestion.answers} />
            ) : (
                <p>Odgovorilo: {answeredCount} / {players.length}</p>
            )}

            <button onClick={handleNext} disabled={phase !== 'stats'}>Sledeće pitanje</button>
            <button onClick={handleEnd}>Završi igru</button>
        </div>
    );
}

export default HostGame;
