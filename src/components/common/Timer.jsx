import { useEffect } from "react";
import useGameStore from "../../stores/gameStore";

function Timer({seconds}) {
    const timeRemaining = useGameStore((s) => s.timeRemaining);
    const setTimer = useGameStore((s) => s.setTimer);

    useEffect(() => {
        setTimer(seconds);

        const interval = setInterval(() => {
            const current = useGameStore.getState().timeRemaining;
            setTimer(current > 0 ? current - 1 : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    return <p>Preostalo vreme: {timeRemaining}s</p>;
}

export default Timer;