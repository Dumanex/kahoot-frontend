import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, ArrowRight, Flag, Users, CheckCircle2, ListOrdered, CircleAlert } from "lucide-react";
import { getSession, startGame, nextQuestion, endGame } from "../api/gameApi";
import { translateErrorResponse } from "../utils/errorMessages";
import useGameStore from "../stores/gameStore";
import { useGameConnection } from "../hooks/useGameConnection";
import { useQuestionPhase } from "../hooks/useQuestionPhase";
import QuestionDisplay from "../components/game/QuestionDisplay";
import QuestionStats from "../components/game/QuestionStats";
import Podium from "../components/game/Podium";
import Timer from "../components/common/Timer";
import PageShell from "../components/layout/PageShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

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
            <PageShell center>
                <div className="flex flex-col items-center gap-6">
                    <h1 className="font-display text-2xl">Igra je završena</h1>
                    <Podium leaderboard={leaderboard} />
                    <Button to={`/results/${pin}`} variant="secondary" icon={ListOrdered}>Pogledaj ceo leaderboard</Button>
                </div>
            </PageShell>
        );
    }

    if (status !== 'playing') {
        return (
            <PageShell center>
                <div className="flex flex-col items-center gap-6 text-center">
                    <h2 className="font-display text-2xl">{quizTitle}</h2>
                    <p className="font-display text-7xl tracking-tight md:text-8xl">{pin}</p>

                    {error && (
                        <p className="flex items-center gap-2 text-sm text-rust">
                            <CircleAlert size={16} />
                            {error}
                        </p>
                    )}

                    <Badge icon={Users}>{players.length} igrača</Badge>
                    <div className="flex flex-wrap justify-center gap-2">
                        {players.map((p) => (
                            <Badge key={p.id} tone="neutral">{p.nickname}</Badge>
                        ))}
                    </div>

                    <Button size="lg" icon={Play} onClick={handleStart} disabled={players.length === 0}>Počni igru</Button>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell center>
            <div className="flex w-full max-w-2xl flex-col items-center gap-6">
                {error && (
                    <p className="flex items-center gap-2 text-sm text-rust">
                        <CircleAlert size={16} />
                        {error}
                    </p>
                )}

                {currentQuestion && <QuestionDisplay question={currentQuestion} phase={phase} />}

                {phase === "answering" && currentQuestion && (
                    <Timer seconds={currentQuestion.timeLimitSeconds} />
                )}

                {currentQuestion && phase === 'stats' ? (
                    <div className="w-full">
                        <QuestionStats roundResults={roundResults} answers={currentQuestion.answers} />
                    </div>
                ) : (
                    <Badge icon={CheckCircle2}>Odgovorilo: {answeredCount} / {players.length}</Badge>
                )}

                <div className="flex gap-3">
                    <Button icon={ArrowRight} onClick={handleNext} disabled={phase !== 'stats'}>Sledeće pitanje</Button>
                    <Button variant="danger" icon={Flag} onClick={handleEnd}>Završi igru</Button>
                </div>
            </div>
        </PageShell>
    );
}

export default HostGame;
