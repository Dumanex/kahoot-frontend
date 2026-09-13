import { useParams } from "react-router-dom";
import useGameStore from "../stores/gameStore";
import { useGameConnection } from "../hooks/useGameConnection";
import QuestionDisplay from "../components/game/QuestionDisplay";
import AnswerOptions from "../components/game/AnswerOptions";
import Timer from "../components/common/Timer";
import Leaderboard from "../components/game/Leaderboard";
import { useState, useEffect } from "react";

function PlayerGame() {
    const { pin } = useParams();
    const nickname = useGameStore((state) => state.nickname);
    const players = useGameStore((state) => state.players);
    const status = useGameStore((state) => state.status);
    const currentQuestion = useGameStore((state) => state.currentQuestion);
    const lastAnswerResult = useGameStore((state) => state.lastAnswerResult);
    const leaderboard = useGameStore((state) => state.leaderboard);
    const [hasAnswered, setHasAnswered] = useState(false);

    const { sendAnswer } = useGameConnection(pin);

    useEffect(() => {
        setHasAnswered(false);
    }, [currentQuestion?.id]);

    const handleAnswer = (answerId) => {
        sendAnswer(currentQuestion.id, answerId);
        setHasAnswered(true);
    };

    if (status === "results") {
        return (
            <div>
                <h1>Igra je završena!</h1>
                <Leaderboard entries={leaderboard} />
            </div>
        );
    }

    if (status !== "playing" || !currentQuestion) {
        return (
            <div>
                <h1>Čekaonica</h1>
                <p>PIN: {pin}</p>
                <p>Nadimak: {nickname}</p>
                <p>Status: {status}</p>
                <h2>Igrači u igri:</h2>
                <ul>
                    {players.map((p) => (
                        <li key={p.id}>{p.nickname} - {p.score} poena</li>
                    ))}
                </ul>    
            </div>
        );
    }

    return (
        <div>
            <Timer key={currentQuestion.id} seconds={currentQuestion.timeLimitSeconds} />
            <QuestionDisplay question={currentQuestion} />

            {hasAnswered ? (
                <p>{lastAnswerResult ? (lastAnswerResult.isCorrect ? "Tačno!" : "Netačno!") : "Sačekaj rezultat..."}</p>
            ): (
                <AnswerOptions answers={currentQuestion.answers} onSelect={handleAnswer} disabled={hasAnswered} />
            )}
        </div>
    );
}

export default PlayerGame;