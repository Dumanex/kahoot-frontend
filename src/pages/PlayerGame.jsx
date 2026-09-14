import { useParams, Link } from "react-router-dom";
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

function PlayerGame() {
    const { pin } = useParams();
    const nickname = useGameStore((state) => state.nickname);
    const players = useGameStore((state) => state.players);
    const status = useGameStore((state) => state.status);
    const currentQuestion = useGameStore((state) => state.currentQuestion);
    const lastAnswerResult = useGameStore((state) => state.lastAnswerResult);
    const leaderboard = useGameStore((state) => state.leaderboard);
    const roundResults = useGameStore((state) => state.roundResults);
    const [hasAnswered, setHasAnswered] = useState(false);

    const { sendAnswer, markAnswerStart } = useGameConnection(pin);
    const phase = useQuestionPhase();

    const shuffledAnswers = useMemo(
        () => (currentQuestion ? shuffle(currentQuestion.answers) : []),
        [currentQuestion?.id]
    );

    useEffect(() => {
        setHasAnswered(false);
    }, [currentQuestion?.id]);

    useEffect(() => {
        if (phase === 'answering') {
            markAnswerStart();
        }
    }, [phase]);

    const handleAnswer = (answerId) => {
        sendAnswer(currentQuestion.id, answerId);
        setHasAnswered(true);
    };

    if (status === "results") {
        return (
            <div>
                <h1>Igra je završena!</h1>
                <Podium leaderboard={leaderboard} />
                <Link to={`/results/${pin}`}>Pogledaj ceo leaderboard</Link>
            </div>
        );
    }

    if (status !== "playing" || !currentQuestion) {
        return (
            <div>
                <h1>Čekaonica</h1>
                <p>PIN: {pin}</p>
                <p>Nadimak: {nickname}</p>
                <p>Čekaj da host pokrene igru...</p>
                <h2>Igrači u igri:</h2>
                <ul>
                    {players.map((p) => (
                        <li key={p.id}>{p.nickname}</li>
                    ))}
                </ul>
            </div>
        );
    }

    if (phase === 'reveal') {
        return (
            <div>
                <QuestionDisplay question={currentQuestion} />
                <p>Spremi se...</p>
            </div>
        );
    }

    if (phase === 'stats') {
        return (
            <div>
                <QuestionDisplay question={currentQuestion} />
                <p>
                    {!lastAnswerResult || lastAnswerResult.chosenAnswerId == null ? "Nisi odgovorio/la na vreme" : (lastAnswerResult.isCorrect ? "Tačno!" : "Netačno!")}
                </p>
                <QuestionStats roundResults={roundResults} answers={currentQuestion.answers} />
            </div>
        );
    }

    return (
        <div>
            <Timer seconds={currentQuestion.timeLimitSeconds} />
            <QuestionDisplay question={currentQuestion} />

            {hasAnswered ? (
                <p>Odgovor poslat! Sačekaj ostale igrače...</p>
            ): (
                <AnswerOptions answers={shuffledAnswers} onSelect={handleAnswer} disabled={hasAnswered} />
            )}
        </div>
    );
}

export default PlayerGame;
