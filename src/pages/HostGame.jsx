import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, ArrowRight, Flag, Users, CheckCircle2, ListOrdered, CircleAlert } from "lucide-react";
import { getSession, startGame, nextQuestion, endGame } from "../api/gameApi";
import { translateErrorResponse } from "../utils/errorMessages";
import { everyoneScoredZero } from "../utils/ranking";
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
import Modal from "../components/ui/Modal";

function HostGame() {
    const { pin } = useParams();
    const [quizTitle, setQuizTitle] = useState('');
    const [error, setError] = useState('');
    const [startRequested, setStartRequested] = useState(false);
    const [nextRequestedFor, setNextRequestedFor] = useState(null);
    const [endConfirmOpen, setEndConfirmOpen] = useState(false);
    const [ending, setEnding] = useState(false);

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
        setStartRequested(true);
        try {
            await startGame(pin);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
            setStartRequested(false);
        }
    };

    const handleNext = async () => {
        setError('');
        setNextRequestedFor(currentQuestion.id);
        try {
            await nextQuestion(pin);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
            setNextRequestedFor(null);
        }
    };

    const handleEnd = async () => {
        setError('');
        setEnding(true);
        try {
            await endGame(pin);
        } catch (err) {
            setError(translateErrorResponse(err.response?.data));
            setEnding(false);
        } finally {
            setEndConfirmOpen(false);
        }
    };

    if (status === 'results') {
        return (
            <PageShell center>
                <div className="flex flex-col items-center gap-6">
                    <h1 className="font-display text-2xl">Igra je završena!</h1>
                    {everyoneScoredZero(leaderboard) ? (
                        <p className="text-ink/60">Partija je završena bez rezultata - niko nije osvojio nijedan poen</p>
                    ) : (
                        <Podium leaderboard={leaderboard} />
                    )}
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

                    <Button size="lg" icon={Play} onClick={handleStart} disabled={players.length === 0 || startRequested}>Počni igru</Button>
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
                    <Button
                        icon={ArrowRight}
                        onClick={handleNext}
                        disabled={phase !== 'stats' || nextRequestedFor === currentQuestion?.id}
                    >
                        Sledeće pitanje
                    </Button>
                    <Button variant="danger" icon={Flag} onClick={() => setEndConfirmOpen(true)} disabled={ending}>Završi igru</Button>
                </div>
            </div>

            <Modal
                open={endConfirmOpen}
                onClose={() => setEndConfirmOpen(false)}
                onConfirm={handleEnd}
                confirmLabel="Završi igru"
                confirmDisabled={ending}
                title="Završi igru?"
            >
                Igra će se odmah završiti za sve igrače i prikazaće se konačni rezultati.
            </Modal>
        </PageShell>
    );
}

export default HostGame;
