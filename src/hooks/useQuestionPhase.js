import { useEffect, useState } from "react";
import useGameStore from "../stores/gameStore";

export function useQuestionPhase() {
    const currentQuestion = useGameStore((s) => s.currentQuestion);
    const timeRemaining = useGameStore((s) => s.timeRemaining);
    const answeredCount = useGameStore((s) => s.answeredCount);
    const players = useGameStore((s) => s.players);
    const [phase, setPhase] = useState('reveal');

    useEffect(() => {
        if (!currentQuestion) return;

        setPhase('reveal');
        const timeout = setTimeout(() => setPhase('answering'), 3000);
        return () => clearTimeout(timeout);
    }, [currentQuestion?.id]);

    useEffect(() => {
        if (phase !== 'answering' || !currentQuestion) return;

        const timesUp = timeRemaining <= 0;
        const everyoneAnswered = players.length > 0 && answeredCount >= players.length;

        if (timesUp || everyoneAnswered) {
            setPhase('stats');
        }
    }, [timeRemaining, answeredCount, players.length, phase]);

    return phase;
}