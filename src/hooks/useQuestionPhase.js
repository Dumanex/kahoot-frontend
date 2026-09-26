import { useEffect, useState } from "react";
import useGameStore from "../stores/gameStore";

export function useQuestionPhase() {
    const currentQuestion = useGameStore((s) => s.currentQuestion);
    const revealEndsAt = useGameStore((s) => s.revealEndsAt);
    const questionFinalized = useGameStore((s) => s.questionFinalized);
    const timeRemaining = useGameStore((s) => s.timeRemaining);
    const answeredCount = useGameStore((s) => s.answeredCount);
    const playerCount = useGameStore((s) => s.players.length);
    const [phase, setPhase] = useState('reveal');
    const [phaseQuestionId, setPhaseQuestionId] = useState(currentQuestion?.id);
    const questionId = currentQuestion?.id;

    if (phaseQuestionId !== questionId) {
        setPhaseQuestionId(questionId);
        setPhase('reveal');
    }

    const timesUp = timeRemaining <= 0;
    const everyoneAnswered = playerCount > 0 && answeredCount >= playerCount;

    if (phase === 'answering' && currentQuestion && (timesUp || everyoneAnswered || questionFinalized)) {
        setPhase('stats');
    }

    useEffect(() => {
        if (questionId === undefined) return;

        const timeout = setTimeout(() => setPhase('answering'), Math.max(0, revealEndsAt - Date.now()));

        return () => clearTimeout(timeout);
    }, [questionId, revealEndsAt]);

    return phase;
}
