import { useEffect, useState } from "react";
import useGameStore from "../stores/gameStore";

export function useQuestionPhase() {
    const currentQuestion = useGameStore((s) => s.currentQuestion);
    const timeRemaining = useGameStore((s) => s.timeRemaining);
    const answeredCount = useGameStore((s) => s.answeredCount);
    const players = useGameStore((s) => s.players);
    const [phase, setPhase] = useState('reveal');
    const [phaseQuestionId, setPhaseQuestionId] = useState(currentQuestion?.id);
    const questionId = currentQuestion?.id;

    if (phaseQuestionId !== currentQuestion?.id) {
        setPhaseQuestionId(currentQuestion?.id);
        setPhase('reveal');
    }

    const timesUp = timeRemaining <= 0;
    const everyoneAnswered = players.length > 0 && answeredCount >= players.length;

    if (phase === 'answering' && currentQuestion && (timesUp || everyoneAnswered)) {
        setPhase('stats');
    }
    
    useEffect(() => {
        if (questionId === undefined) return;

        const timeout = setTimeout(() => setPhase('answering'), 3000);

        return () => clearTimeout(timeout);
    }, [questionId]);

    return phase;
}