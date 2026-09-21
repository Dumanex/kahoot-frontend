import { useParams } from "react-router-dom";
import { Hourglass, CheckCircle2, XCircle, ListOrdered } from "lucide-react";
import useGameStore from "../stores/gameStore";
import { useGameConnection } from "../hooks/useGameConnection";
import { useQuestionPhase } from "../hooks/useQuestionPhase";
import { shuffle } from "../utils/shuffle";
import QuestionDisplay from "../components/game/QuestionDisplay";
import AnswerOptions from "../components/game/AnswerOptions";
import Timer from "../components/common/Timer";
import QuestionStats from "../components/game/QuestionStats";
import Podium from "../components/game/Podium";
import { useState, useEffect, useMemo } from "react";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

function PlayerGame() {
    const { pin } = useParams();
    const nickname = useGameStore((state) => state.nickname);
    const players = useGameStore((state) => state.players);
    const status = useGameStore((state) => state.status);
    const currentQuestion = useGameStore((state) => state.currentQuestion);
    const lastAnswerResult = useGameStore((state) => state.lastAnswerResult);
    const leaderboard = useGameStore((state) => state.leaderboard);
    const roundResults = useGameStore((state) => state.roundResults);
    const [answeredQuestionId, setAnsweredQuestionId] = useState(null);
    const hasAnswered = answeredQuestionId === currentQuestion?.id;

    const { sendAnswer, markAnswerStart } = useGameConnection(pin);
    const phase = useQuestionPhase();

    const shuffledAnswers = useMemo(
        () => (currentQuestion ? shuffle(currentQuestion.answers) : []),
        [currentQuestion?.id]
    );

    useEffect(() => {
        if (phase === 'answering') {
            markAnswerStart();
        }
    }, [phase]);

    const handleAnswer = (answerId) => {
        sendAnswer(currentQuestion.id, answerId);
        setAnsweredQuestionId(currentQuestion.id);
    };

    if (status === "results") {
        return (
            <PageShell center>
                <div className="flex flex-col items-center gap-6">
                    <h1 className="font-display text-2xl">Igra je završena!</h1>
                    <Podium leaderboard={leaderboard} />
                    <Button to={`/results/${pin}`} variant="secondary" icon={ListOrdered}>Pogledaj ceo leaderboard</Button>
                </div>
            </PageShell>
        );
    }

    if (status !== "playing" || !currentQuestion) {
        return (
            <PageShell center>
                <div className="flex flex-col items-center gap-6 text-center">
                    <h1 className="font-display text-2xl">Čekaonica</h1>
                    <p className="font-display text-5xl tracking-[0.2em]">{pin}</p>
                    <Badge>{nickname}</Badge>
                    <p className="flex items-center gap-2 text-ink/60">
                        <Spinner size={16} />
                        Čekaj da host pokrene igru...
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {players.map((p) => (
                            <Badge key={p.id} tone="neutral">{p.nickname}</Badge>
                        ))}
                    </div>
                </div>
            </PageShell>
        );
    }

    if (phase === 'reveal') {
        return (
            <PageShell center>
                <div className="flex flex-col items-center gap-4">
                    <QuestionDisplay question={currentQuestion} phase={phase} />
                    <p className="flex items-center gap-2 text-ink/60">
                        <Hourglass size={18} />
                        Spremi se...
                    </p>
                </div>
            </PageShell>
        );
    }

    if (phase === 'stats') {
        const noAnswer = !lastAnswerResult || lastAnswerResult.chosenAnswerId == null;
        return (
            <PageShell center>
                <div className="flex flex-col items-center gap-4">
                    <QuestionDisplay question={currentQuestion} phase={phase} />
                    {noAnswer ? (
                        <p className="text-lg text-ink/60">Nisi odgovorio/la na vreme</p>
                    ) : lastAnswerResult.isCorrect ? (
                        <p className="flex items-center gap-2 font-display text-3xl text-moss">
                            <CheckCircle2 size={32} />
                            Tačno!
                        </p>
                    ) : (
                        <p className="flex items-center gap-2 font-display text-3xl text-rust">
                            <XCircle size={32} />
                            Netačno!
                        </p>
                    )}
                    <div className="w-full max-w-md">
                        <QuestionStats roundResults={roundResults} answers={currentQuestion.answers} />
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell center>
            <div className="flex w-full max-w-2xl flex-col items-center gap-6">
                <Timer seconds={currentQuestion.timeLimitSeconds} />
                <QuestionDisplay question={currentQuestion} phase={phase} />

                {hasAnswered ? (
                    <Card className="flex items-center gap-2 text-ink/60">
                        <CheckCircle2 size={18} className="text-moss" />
                        Odgovor poslat! Sačekaj ostale igrače...
                    </Card>
                ) : (
                    <div className="w-full">
                        <AnswerOptions answers={shuffledAnswers} onSelect={handleAnswer} disabled={hasAnswered} />
                    </div>
                )}
            </div>
        </PageShell>
    );
}

export default PlayerGame;
